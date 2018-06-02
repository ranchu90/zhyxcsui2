import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import {workIndexes, workIndexesWithPage, updateWorkIndexByApprovalState, getworkIndexNum} from '../api/workindex';
import {getImages, getBase64Image} from '../api/image';
import {getReview, insertReview} from '../api/approval_record';
import review_opinions from '../constant/review_opinion';
import approval_state from '../constant/approval_state';

Cropper.setDefaults({
    viewMode: 1,
    dragMode: 'move',
    autoCrop: false,
    toggleDragModeOnDblclick: false
});

export default {
    data () {
        return {
            table_cols: [],
            table_list: [],
            table_default_cols: [
                {
                    type:'index',
                    align:'center',
                    width:60
                },
                {
                    title: '流水号',
                    key: 'stransactionnum'
                },
                {
                    title: '存款人名称',
                    key: 'sdepositorname'
                },
                {
                    title: '审批状态',
                    key: 'sapprovalstate'
                },
                {
                    title: '加急状态',
                    key: 'sbusinessemergency',
                    render:(h, params) => {
                        const state = params.row.sbusinessemergency;
                        const color = (state === '1') ? 'red' : 'blue';
                        const text = (state === '1') ? '加急' : '未加急';

                        return h('Tag', {
                            props:{
                                type: 'dot',
                                color: color
                            }
                        }, text);
                    }
                },
                {
                    title: '业务类别',
                    key: 'sbusinesscategory'
                },
                {
                    title: '账户种类',
                    key: 'saccounttype'
                },
                {
                    title:'开户银行机构代码',
                    key: 'sbankcode'
                },
                {
                    title:'开户银行机构名称',
                    key: 'sbankname'
                },
                {
                    title:'录入开始时间',
                    key: 'sstarttime'
                }
            ],
            table_review: {
                title: '操作',
                key: 'action',
                width: 150,
                align: 'center',
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.workIndex = params.row;
                                    this.ifEdit = true;
                                    this.getSavedImages();
                                    //动态设置图片列表的高度
                                    this.$nextTick(()=>{
                                        if (this.$refs.attachment) {
                                            this.img_list_height = this.$refs.attachment.clientHeight;
                                        }
                                    });
                                }
                            }
                        }, '复核')
                    ]);
                }
            },
            table_stoped:{
                title: '查看',
                key: 'action',
                width: 150,
                align: 'center',
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.workIndex = params.row;
                                    this.ifEdit = true;
                                    this.getSavedImages();
                                    //动态设置图片列表的高度
                                    this.$nextTick(()=>{
                                        if (this.$refs.attachment) {
                                            this.img_list_height = this.$refs.attachment.clientHeight;
                                        }
                                    });

                                    var data = {
                                        transactionNum:this.workIndex.stransactionnum
                                    };

                                    getReview(data).then(response => {
                                        if (response.status == 200){
                                            const data = response.data;
                                            if (data.length > 0){
                                                this.latestReview = data[0].sapprovelresult
                                                    + ':' + data[0].sapprovelopinion;
                                            }

                                            this.ifLook = true;
                                        }
                                    }).catch(error => {
                                        this.$Message.error(error.message);
                                    });
                                }
                            }
                        }, '查看')
                    ]);
                }
            },
            table_loading:false,
            bank_entry:'跳转到银行录入员',
            main_img_url:'',
            attachment_img_url:'',
            preview_img_url:'',
            check_img_url:'',
            cropped_main: false,
            cropped_attachment: false,
            cropper_main:null,
            cropper_attachment: null,
            cropper_preview:null,
            cropper_check:null,
            src_img_files:[],
            dest_img_files:[],
            checkModal:false,
            previewModal:false,
            newTaskModal:false,
            src_radio_model:true,
            showAttachSelect:true,
            formItem:null,
            /*分页*/
            pageSize:10,
            currentPage:1,
            totalPages:100,
            certi_kind_list:[
                {
                    value: '登记证件（批文）',
                    label: '登记证件（批文）'
                },
                {
                    value: '法定代表（负责人）身份证件',
                    label: '法定代表（负责人）身份证件'
                },
                {
                    value: '其他（上级）',
                    label: '其他（上级）'
                }
            ],
            file_type:{
                file_type:''
            },
            file_number:1,
            check_preview_info:'',
            workIndex: {
                stransactionnum:'',
                sdepositorname:'',
                sbusinesscategory:'',
                saccounttype:'',
                sbankcode:'',
                sbankname:'',
                supusercode:'',
                supusername:''
            },
            ifEdit:false,
            rules: {
                sbusinesscategory: [{ required: true, message: '业务类别不能为空', trigger: 'blur' }],
                saccounttype: [{ required: true, message: '账户种类不能为空', trigger: 'blur' }],
                sdepositorname: [{ required:true, message: '存款人名称不能为空', trigger:'blur' }]
            },
            file_type_rules: {
                file_type: [{ required: true, message: '附件类型不能为空', trigger: 'blur' }]
            },
            img_list_height: 600,
            //选中的tab标签，编辑，复核，审核，通过
            tabSelected:1,
            review:'',
            img_hidden:false,
            breadCrumb:'',
            reviewOpinion:review_opinions,
            accelerated:false, //是否申请加急状态
            accelerate_Num:0,
            review_Num:0,

        };
    },
    components:{
        'my-dest-image':{
            props:['imgfile','index'],
            data:function(){
                return {
                    id:'dest-img-'+this.index,
                    file:this.imgfile
                };
            },
            render:function (createElement) {
                if (!this.imgfile.ifBase64){
                    console.log(this.id);
                    let that = this;
                    getBase64Image({
                        path: this.imgfile.src
                    }).then(response => {
                        if (response.status == 200){
                            var image = document.getElementById(this.id);
                            image.src = 'data:image/jpg;base64,' + response.data.src;
                            if (this.file.number === '0000' || this.file.number === '0001'){
                                const data = {
                                    src: image.src,
                                    number: this.file.number
                                };

                                this.initCropperImage(data);
                            }
                        }
                    }).catch(error => {
                        this.$Message.error(error.message);
                    });
                }

                return createElement('div',{
                    style:{
                        position: 'relative'
                    }
                },[
                    createElement('img' ,{
                        style:{
                            width:'50px',
                            height:'50px',
                            zIndex:'1'
                        },
                        attrs:{
                            id:this.id,
                            src: this.imgfile.ifBase64 ? this.file.src : ''
                        },
                        on:{
                            '!click':this.prepareImage
                        }
                    })
                ]);
            },
            methods:{
                prepareImage:function () {
                    this.$emit('prepareImage', this.id);
                },
                initCropperImage:function (data) {
                    this.$emit('initCropperImage', data);
                }
            }
        }
    },
    watch:{
        ifEdit:function () {
            //从编辑状态转为不编辑状态时 重置相关变量
            if (!this.ifEdit){
                this.businessList = [];
                this.accountTypeList = [];
                this.workIndex = {
                    stransactionnum:'',
                    sdepositorname:'',
                    sbusinesscategory:'',
                    saccounttype:'',
                    sbankcode:'',
                    sbankname:'',
                    supusercode:'',
                    supusername:''
                };
                this.src_img_files = [];
                this.dest_img_files = [];
                this.resetCropper();
                this.main_img_url = '';
                this.attachment_img_url = '';
                this.review = '';
                this.file_number = 1;
                this.accelerated = false; //是否申请加急状态
                this.getBages();
            }
        }
    },
    methods: {
        changeTab: function (name) {
            this.table_cols = [];
            [...this.table_cols] = this.table_default_cols;

            this.accelerated = false;

            switch (name){
                case 'review':
                    this.tabSelected = approval_state.APPROVAL_STATE_COMMERCE_REVIEW;
                    this.table_cols.push(this.table_review);
                    this.breadCrumb = '待复核';
                    break;
                case 'recheck':
                    this.tabSelected = approval_state.APPROVAL_STATE_PBC_CHECK;
                    this.breadCrumb = '待审核';
                    break;
                // case 'pass': this.tabSelected = 4;break;
                case 'passed':
                    this.tabSelected = approval_state.APPROVAL_STATE_PBC_PASS_AUDIT;
                    this.breadCrumb = '已通过';
                    break;
                case 'accelerate':
                    this.tabSelected = approval_state.APPROVAL_STATE_COMMERCE_REVIEW;
                    this.table_cols.push(this.table_review);
                    this.accelerated = true;
                    this.breadCrumb = '加急通道';
                    break;
                case 'stoped':
                    this.tabSelected = approval_state.APPROVAL_STATE_ERROR;
                    this.table_cols.push(this.table_stoped);
                    this.breadCrumb = '已终止';
                    break;
            }

            if (this.ifEdit){
                this.ifEdit = false;
            }

            this.changePage();
        },
        changePage:function (page) {
            this.table_loading = true;

            if (page != null){
                this.currentPage = page;
            }

            var data = {
                pageSize: this.pageSize,
                currentPage: this.currentPage,
                approvalState: this.tabSelected,
                businessEmergency : this.tabSelected === approval_state.APPROVAL_STATE_COMMERCE_REVIEW ? (this.accelerated ? 1 : 0) : ''
            };

            workIndexesWithPage(data).then(response => {
                if (response.status == 200){
                    this.table_list = response.data.workIndexList;
                    this.totalPages = response.data.totalPages;
                    this.table_loading = false;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        changePageSize:function (pageSize) {
            this.table_loading = true;

            if (pageSize != null){
                this.pageSize = pageSize;
            }

            var data = {
                pageSize: this.pageSize,
                currentPage: this.currentPage,
                approvalState: this.tabSelected,
                businessEmergency : this.accelerated != 4 ? (this.accelerated ? 1 : 0) : ''
            };

            workIndexesWithPage(data).then(response => {
                if (response.status == 200){
                    this.table_list = response.data.workIndexList;
                    this.totalPages = response.data.totalPages;
                    this.table_loading = false;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        /*图片编辑，放大旋转，剪裁*/
        zoom: function (name, type) {
            switch (type) {
                case 'main':
                    this.cropper_main.zoom(name);
                    break;
                case 'attachment':
                    this.cropper_attachment.zoom(name);
                    break;
            }
        },
        rotate: function (type) {
            switch (type) {
                case 'main':
                    this.cropper_main.rotate(90);
                    break;
                case 'attachment':
                    this.cropper_attachment.rotate(90);
                    break;
            }
        },
        /*图片预览*/
        imgPreview(file, type) {
            this.updateCropper(file.src, type);
        },
        updateCropper: function (url, type) {
            switch (type) {
                case 'main':
                    this.main_img_url = url;
                    this.cropper_main.replace(url, false);
                    this.cropped_main = false;
                    break;
                case 'attachment':
                    this.attachment_img_url = url;
                    this.cropper_attachment.replace(url, false);
                    this.cropped_attachment = false;
                    break;
                case 'check':
                    this.cropper_check.replace(url, false);
                    this.check_img_url = url;
                    this.checkModal = true;
            }
        },
        prepareImage: function (id) {
            var image = document.getElementById(id);
            this.imgPreview(image, 'attachment');
        },
        transStringToNumber: function (numStr) {
            var i = new Number(numStr);
            return i;
        },
        formatNumberToString: function (number) {
            var numStr = '';

            if (number >= 0 && number <= 9) {
                numStr = '000' + number;
            } else if (number > 9 && number <= 99) {
                numStr = '00' + number;
            } else if (number > 99 && number <= 999) {
                numStr = '0' + number;
            }

            return numStr;
        },
        getSavedImages:function () {
            var data = {
                stransactionnum: this.workIndex.stransactionnum
            };
            getImages(data).then(response => {
                if(response.status == '200'){
                    const data = response.data;
                    this.dest_img_files = [];

                    for (var i=0; i<data.length; ++i){
                        var config = {
                            ifBase64:false,
                            src: data[i].sstorepath,
                            type: data[i].sproofname,
                            number: data[i].simagetype == 0? '0000' : this.formatNumberToString(this.file_number),
                            date: Date().toString(),
                            sid: data[i].sid
                        };

                        if (data[i].sproofname != '申请书') {
                            //尾插
                            this.dest_img_files.push(config);
                            ++this.file_number;

                            // if (config.number == '0001') {
                            //     getBase64Image({
                            //         path: data[i].sstorepath
                            //     }).then(response => {
                            //         if (response.status == 200){
                            //             var image = 'data:image/jpg;base64,' + response.data.src;
                            //             this.updateCropper(image, 'attachment');
                            //         }
                            //     }).catch(error => {
                            //         this.$Message.error(error.message);
                            //     });
                            // }
                        } else {
                            getBase64Image({
                                path: data[i].sstorepath
                            }).then(response => {
                                if (response.status == 200){
                                    var image = 'data:image/jpg;base64,' + response.data.src;
                                    this.updateCropper(image, 'main');
                                }
                            }).catch(error => {
                                this.$Message.error(error.message);
                            });
                        }
                    }
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        initCropperImage:function (data) {
            var imgSrc = data.src;
            var number = data.number;

            switch (number){
                case '0000':
                    this.ifSaved = true;
                    this.updateCropper(imgSrc, 'main');
                    break;
                case '0001':
                    this.updateCropper(imgSrc, 'attachment');
                    break;
            }
        },
        /*分页数据*/
        getWorkIndexes:function () {
            workIndexes().then(response => {
                this.table_list = response.data;
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        updateWorkIndexByApprovalStateBack:function () {
            this.$Modal.confirm({
                title: '退回确认',
                content: '是否确认退回至商业银行录入员？',
                onOk: () => {
                    const data = {
                        sapprovalstate: approval_state.APPROVAL_STATE_NO_PASS,
                        stransactionnum: this.workIndex.stransactionnum,
                        sreturntimes: this.workIndex.sreturntimes
                    };
                    const params = {
                        action:'send_back'
                    };

                    updateWorkIndexByApprovalState(data, params).then(response => {
                        if (response.status == 200){
                            this.$Message.info('任务已退回至商业银行录入员！');
                            this.ifEdit = false;
                            this.updateWorkIndexReview('复核未通过');
                        }
                    }).catch(error => {
                        this.$Message.info(error.message);
                    });

                }, onCancel: () => {
                }
            });
        },
        updateWorkIndexByApprovalState:function () {
            this.$Modal.confirm({
                title: '提交确认',
                content: '是否确认提交至人民银行审核员？',
                onOk: () => {
                    const data = {
                        sapprovalstate: approval_state.APPROVAL_STATE_PBC_CHECK,
                        stransactionnum: this.workIndex.stransactionnum
                    };
                    const params = {
                        action:'review'
                    };
                    updateWorkIndexByApprovalState(data, params).then(response => {
                        if (response.status == 200){
                            this.$Message.info('任务已提交至审核员！');
                            this.ifEdit = false;
                            this.updateWorkIndexReview('复核已通过');
                        }
                    }).catch(error => {
                        this.$Message.info(error.message);
                    });

                }, onCancel: () => {
                }
            });
        },
        updateWorkIndexReview:function (result) {
            insertReview({
                stransactionnum: this.workIndex.stransactionnum,
                sapprovelresult: result,
                sapprovelopinion: this.review
            }).then(response => {
                if (response.status == 200){
                    this.$Message.info('审批意见已提交！');
                    this.ifEdit = false;
                    this.changeTab('review');
                }
            }).catch(error => {
                this.$Message.info(error.message);
            });
        },
        initCropper:function () {
            var image_main = document.getElementById('image_main');
            var image_attachment = document.getElementById('image_attachment');

            //初始化申请书编辑区
            this.cropper_main = new Cropper(image_main, {
                aspectRatio: 210 / 297,
                ready: function () {

                }
            });
            //初始化附件编辑区
            this.cropper_attachment = new Cropper(image_attachment, {
                aspectRatio: 210 / 297,
                ready: function () {

                }
            });
        },
        resetCropper:function () {
            this.cropper_main.destroy();
            this.cropper_attachment.destroy();

            var image_main = document.getElementById('image_main');
            var image_attachment = document.getElementById('image_attachment');

            //初始化申请书编辑区
            this.cropper_main = new Cropper(image_main, {
                aspectRatio: 210 / 297,
                ready: function () {

                }
            });

            //初始化附件编辑区
            this.cropper_attachment = new Cropper(image_attachment, {
                aspectRatio: 210 / 297,
                ready: function () {

                }
            });
        },
        /*审批意见预设意见响应*/
        onSelectOpinions:function (name) {
            this.review += this.reviewOpinion[name];
        },
        getBages:function () {
            //review
            getworkIndexNum({
                approvalState: approval_state.APPROVAL_STATE_COMMERCE_REVIEW,
                businessEmergency: 0
            }).then(response => {
                if (response.status == 200){
                    this.review_Num = response.data;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });

            //accelerate
            getworkIndexNum({
                approvalState: approval_state.APPROVAL_STATE_COMMERCE_REVIEW,
                businessEmergency: 1
            }).then(response => {
                if (response.status == 200){
                    this.accelerate_Num = response.data;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        }
    },
    mounted:function () {
        this.$nextTick(() => {
            this.changeTab('accelerate');
        });

        this.initCropper();
        this.getBages();
    }
};
