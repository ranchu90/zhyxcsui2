import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import {
    supervisionsWithPage,
    updateSupervisionByApprovalState,
    getSupervisionNum,
    queryOperators,
    occupyTransaction
} from '../../api/newApi/sv_supervision';
import {getImages, getBase64Image} from '../../api/newApi/sv_image';
import {getReview, insertReview} from '../../api/approval_record';
import review_opinions from '../../constant/review_opinion';
import approval_state from '../../constant/sv_approval_state';
import {svBasicCategory, businessCategory} from "../../api/newApi/sv_image_standard";

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
                    title: '流程状态',
                    key: 'sapprovalstate'
                },
                {
                    title: '状态',
                    key: 'skind',
                    render:(h, params) => {
                        const state = params.row.skind;
                        var color = '';
                        var text = '';
                        switch (state) {
                            case '0': color = 'blue';
                                text = '正常';
                                break;
                            case '1': color = 'red';
                                text = '整改中';
                                break;
                            case '2': color = 'green';
                                text = '整改完成';
                                break;
                        }

                        return h('Tag', {
                            props:{
                                type: 'dot',
                                color: color
                            }
                        }, text);
                    }
                },
                {
                    title: '开户日期',
                    key: 'saccounttime'
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
                    title:'账号',
                    key: 'saccountnum'
                },
                {
                    title:'开户日期',
                    key: 'saccounttime'
                },
                {
                    title:'录入时间',
                    key: 'sendtime'
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

                                    occupyTransaction(this.workIndex.stransactionnum).then(response => {
                                        if (response.status == 200){
                                            const data = response.data;
                                            if (!data.hasOwnProperty('error')){
                                                this.ifEdit = true;
                                                this.getSavedImages();
                                                //动态设置图片列表的高度
                                                this.$nextTick(()=>{
                                                    if (this.$refs.attachment) {
                                                        this.img_list_height = this.$refs.attachment.clientHeight;
                                                    }
                                                });

                                                queryOperators(this.workIndex.stransactionnum).then(response => {
                                                    if (response.status == 200){
                                                        const data = response.data;
                                                        if (!data.hasOwnProperty('error')){
                                                            this.operators = data;
                                                        }
                                                    }
                                                }).catch(error => {
                                                    this.$Message.error(error.message);
                                                });
                                            } else {
                                                this.$Message.error(data.error);
                                                this.changePage();
                                            }
                                        }
                                    }).catch(error => {
                                        this.$Message.error(error.message);
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
                width: 100,
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

                                    queryOperators(this.workIndex.stransactionnum).then(response => {
                                        if (response.status == 200){
                                            const data = response.data;
                                            if (!data.hasOwnProperty('error')){
                                                this.operators = data;
                                            }
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
            table_complete:{
                title:'审核时间',
                key: 'scompletetimes'
            },
            table_endTime:{
                title:'提交人行时间',
                key: 'scommittimes'
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
                supusername:'',
                saccounttime:'',
                saccountclosetime:'',
                suniquesocialcreditcode:'',
                saccountnum:''
            },
            ifEdit:false,
            ifLook:false,
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
            previewModalHeight: 0,
            previewModalWidth: 0,
            operators:[],
            formSearch:{
                fBankCode: null,
                fDepositorName: null,
                fBusinessType: null
            },
            businessList:[],
            latestReview:''
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
                            // var image = document.getElementById(this.id);
                            // image.src = 'data:image/jpg;base64,' + response.data.src;
                            // if (this.file.number === '0000' || this.file.number === '0001'){
                            //     const data = {
                            //         src: image.src,
                            //         number: this.file.number
                            //     };
                            //
                            //     this.initCropperImage(data);
                            // }

                            const file = response.data;

                            let self = this;
                            // 创建一个reader
                            let reader = new FileReader();

                            // 看支持不支持FileReader
                            if (!file || !window.FileReader) return;

                            // if (/^image/.test(file.type)) {
                            // 将图片将转成 base64 格式
                            reader.readAsDataURL(file);
                            // 读取成功后的回调
                            reader.onloadend = function () {
                                // self.updateCropper(this.result);

                                var image = document.getElementById(self.id);
                                image.src = this.result;
                                self.src = image.src;

                                self.updateImgDestFiles({
                                    src: image.src,
                                    ifBase64:true,
                                    index: self.index
                                });

                                if (self.file.number === '0000' || self.file.number === '0001'){
                                    const data = {
                                        src: image.src,
                                        number: self.file.number
                                    };

                                    self.initCropperImage(data);
                                }
                            };
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
                },
                updateImgDestFiles:function (data) {
                    this.$emit('updateImgDestFiles', data);
                }
            }
        }
    },
    watch:{
        ifEdit:function () {
            //从编辑状态转为不编辑状态时 重置相关变量
            if (!this.ifEdit){
                this.accountTypeList = [];
                this.workIndex = {
                    stransactionnum:'',
                    sdepositorname:'',
                    sbusinesscategory:'',
                    saccounttype:'',
                    sbankcode:'',
                    sbankname:'',
                    supusercode:'',
                    supusername:'',
                    saccounttime:'',
                    saccountclosetime:'',
                    suniquesocialcreditcode:'',
                    saccountnum:''
                };
                this.src_img_files.splice(0, this.src_img_files.length);
                this.dest_img_files.splice(0, this.dest_img_files.length);
                this.resetCropper();
                this.main_img_url = '';
                this.attachment_img_url = '';
                this.review = '';
                this.file_number = 1;
                this.accelerated = false; //是否申请加急状态
                this.getBages();
                this.changePage();
            }
        }
    },
    methods: {
        changeTab: function (name) {
            this.table_cols = [];
            [...this.table_cols] = this.table_default_cols;
            this.table_list = [];

            this.accelerated = false;

            this.resetConditions();

            this.currentPage = 1;

            switch (name){
                case 'review':
                    this.tabSelected = approval_state.APPROVAL_STATE_COMMERCE_REVIEW;
                    this.table_cols.push(this.table_review);
                    this.breadCrumb = '待复核';
                    break;
                case 'recheck':
                    this.tabSelected = approval_state.APPROVAL_STATE_PBC_CHECK;
                    this.breadCrumb = '待审核';
                    this.table_cols.push(this.table_endTime);
                    break;
                // case 'pass': this.tabSelected = 4;break;
                case 'passed':
                    this.tabSelected = approval_state.APPROVAL_STATE_END;
                    this.table_cols.push(this.table_endTime);
                    this.table_cols.push(this.table_complete);
                    this.table_cols.push(this.table_stoped);
                    this.breadCrumb = '已通过';
                    break;
                case 'stoped':
                    this.tabSelected = approval_state.APPROVAL_STATE_FORCE_END;
                    this.table_cols.push(this.table_endTime);
                    this.table_cols.push(this.table_complete);
                    this.table_cols.push(this.table_stoped);
                    this.breadCrumb = '终止业务';
                    break;
                case 'correct':
                    this.tabSelected = approval_state.APPROVAL_STATE_NO_PASS;
                    this.table_cols.push(this.table_endTime);
                    this.table_cols.push(this.table_complete);
                    this.table_cols.push(this.table_stoped);
                    this.breadCrumb = '待整改';
                    break;
            }

            if (this.ifEdit){
                this.ifEdit = false;
            }
            this.getBages();
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
                depositorName: this.formSearch.fDepositorName,
                businessType: this.formSearch.fBusinessType
            };

            supervisionsWithPage(data).then(response => {
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
                approvalState: this.tabSelected
            };

            supervisionsWithPage(data).then(response => {
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
                    this.dest_img_files.splice(0, this.dest_img_files.length);

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

                        } else {
                            //获取申请书的图片
                            getBase64Image({
                                path: data[i].sstorepath
                            }).then(response => {
                                if (response.status == 200){
                                    const file = response.data;

                                    let self = this;
                                    // 创建一个reader
                                    let reader = new FileReader();

                                    // 看支持不支持FileReader
                                    if (!file || !window.FileReader) return;

                                    // if (/^image/.test(file.type)) {
                                    // 将图片将转成 base64 格式
                                    reader.readAsDataURL(file);
                                    // 读取成功后的回调
                                    reader.onloadend = function () {
                                        self.updateCropper(this.result, 'main');
                                    };
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

                    updateSupervisionByApprovalState(data, params).then(response => {
                        if (response.status == 200){
                            if (!data.hasOwnProperty('error')) {
                                this.$Message.info('任务已退回至商业银行录入员！');
                                this.ifEdit = false;
                                this.updateWorkIndexReview('复核未通过');
                            } else {
                                this.$Message.info(data.error);
                                this.ifEdit = false;
                            }

                        }
                    }).catch(error => {
                        this.$Message.info(error.message);
                    });

                }, onCancel: () => {
                }
            });
        },
        updateSupervisionByApprovalState:function () {
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
                    updateSupervisionByApprovalState(data, params).then(response => {
                        if (response.status == 200){
                            if (!data.hasOwnProperty('error')) {
                                this.$Message.info('任务已提交至审核员！');
                                this.ifEdit = false;
                                this.updateWorkIndexReview('复核已通过');
                            } else {
                                this.$Message.info(data.error);
                                this.ifEdit = false;
                            }

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
            businessCategory().then((response) => {
                if(response.status == '200'){
                    this.businessList = response.data;
                }
            }).catch((error)=>{
                this.$Message.error(error.message);
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
        updateImgDestFiles:function (data) {
            if (this.dest_img_files[data.index] != null) {
                this.dest_img_files[data.index].src = data.src;
                this.dest_img_files[data.index].ifBase64 = true;
            }
        },
        /*审批意见预设意见响应*/
        onSelectOpinions:function (name) {
            this.review += this.reviewOpinion[name];
        },
        getBages:function () {
            //review
            getSupervisionNum({
                approvalState: approval_state.APPROVAL_STATE_COMMERCE_REVIEW,
                businessEmergency: 0
            }).then(response => {
                if (response.status == 200){
                    this.review_Num = response.data;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });

            // //accelerate
            // getSupervisionNum({
            //     approvalState: approval_state.APPROVAL_STATE_COMMERCE_REVIEW
            // }).then(response => {
            //     if (response.status == 200){
            //         this.accelerate_Num = response.data;
            //
            //         // if (this.accelerate_Num > 0 ){
            //         //     this.$Modal.info({
            //         //         title: '温馨提示',
            //         //         content: '请优先审核加急通道业务！'
            //         //     });
            //         // }
            //     }
            // }).catch(error => {
            //     this.$Message.error(error.message);
            // });
        },
        returnBack:function () {
            this.changePage();
            this.ifEdit = false;
            this.ifLook = false;
        },
        showOperators:function () {
            var text = '银行录入：' + this.operators.upUserName;
            if (this.operators.reviewName != null){
                text += ' 银行复核：' + this.operators.reviewName;
            }

            if (this.operators.checkName != null){
                text += ' 人行审核：' + this.operators.checkName;
            }

            if (this.operators.recheckName != null){
                text += ' 人行复审：' + this.operators.recheckName;
            }

            this.$Notice.info({
                title: '经办人',
                desc: text,
                duration: 10
            });
        },
        searchByConditions:function () {
            this.changePage(1);
        },
        resetConditions:function () {
            this.formSearch.fBankCode = null;
            this.formSearch.fDepositorName = null;
            this.formSearch.fBusinessType = null;
        },
        downloadImg:function (img) {
            let blob = this.base64ToBlob(img.src);
            let url = window.URL.createObjectURL(blob);
            let link = document.getElementById('receipt');
            link.style.display = 'none';
            link.href = url;
            link.target = '_blank'
            link.setAttribute('download', this.workIndex.stransactionnum + img.type + ".jpeg");
            link.click();
            URL.revokeObjectURL(link.href);
        },
        /*base64 to Blob*/
        base64ToBlob(code) {
            let parts = code.split(';base64,');
            let contentType = parts[0].split(':')[1];
            let raw = window.atob(parts[1]);
            let rawLength = raw.length;

            let uInt8Array = new Uint8Array(rawLength);

            for (let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], {type: contentType});
        }
    },
    mounted:function () {
        this.$nextTick(() => {
            this.changeTab('review');
        });

        this.initCropper();
        this.getBages();
    }
};
