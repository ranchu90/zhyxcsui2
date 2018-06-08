import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import {workIndex, workIndexes, updateWorkIndexByDepositor, updateWorkIndexByApprovalState,
    deleteWorkIndex, workIndexesWithPage, getReceipt, getworkIndexNum, updateBusinessEmergency} from '../api/workindex';
import {certificateType, basicCategory} from '../api/image_standard';
import {uploadImage, deleteImage, getImages, getBase64Image} from '../api/image';
import {getReview} from '../api/approval_record';
import {bankReviewCheck} from '../api/user';
import {getLicenceImage} from '../api/licence';
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
            data: [],
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
                    width: 90,
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
                }
            ],
            table_edit: {
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
                                    this.certificateType();

                                    //动态设置图片列表的高度
                                    this.$nextTick(()=>{
                                        if (this.$refs.attachment) {
                                            this.img_list_height = this.$refs.attachment.clientHeight;
                                        }
                                        this.getSavedImages();
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
                                        }
                                    }).catch(error => {
                                        this.$Message.error(error.message);
                                    });
                                }
                            }
                        }, '编辑'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.$Modal.confirm({
                                        title:'确认删除流水号：'+params.row.stransactionnum+'？',
                                        content:'是否删除流水号：'+params.row.stransactionnum+'的任务',
                                        onOk:() => {
                                            var data = {
                                                stransactionnum:params.row.stransactionnum
                                            }
                                            deleteWorkIndex(data).then(response => {
                                                if (response.status == 200){
                                                    this.$Message.success('删除成功！');
                                                    this.table_list.splice(params.index, 1);
                                                    this.getBages();
                                                }
                                            }).catch(error => {
                                                this.$Message.error(error.message);
                                            });
                                        }
                                    });
                                }
                            }
                        }, '删除')
                    ]);
                }
            },
            table_review: {
                title: '操作',
                key: 'action',
                width: 150,
                align: 'center',
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    let transactionNum = params.row.stransactionnum;
                                    this.$Modal.confirm({
                                        title:'确认撤回流水号：'+params.row.stransactionnum+'？',
                                        content:'是否撤回流水号：'+params.row.stransactionnum+'的任务',
                                        onOk:() => {
                                            const data = {
                                                sapprovalstate: approval_state.APPROVAL_STATE_COMMERCE_NEW,
                                                stransactionnum: transactionNum
                                            };
                                            const params = {
                                                action:'call_back'
                                            };
                                            updateWorkIndexByApprovalState(data, params).then(response => {
                                                if (response.status == 200){
                                                    this.$Message.success('撤回成功！');
                                                    this.changeTab('review');
                                                    this.getBages();
                                                }
                                            }).catch(error => {
                                                this.$Message.error(error.message);
                                            });
                                        }
                                    })
                                }
                            }
                        }, '撤回'),
                        h('Button', {
                            props: {
                                type: 'success',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    let transactionNum = params.row.stransactionnum;
                                    this.$Modal.confirm({
                                        title:'确认加急流水号：'+params.row.stransactionnum+'？',
                                        content:'是否加急流水号：'+params.row.stransactionnum+'的任务',
                                        onOk:() => {
                                            const data = {
                                                sbusinessemergency: 1,
                                                stransactionnum:transactionNum
                                            };
                                            updateBusinessEmergency(data).then(response => {
                                                if (response.status == 200){
                                                    if (response.data > 0){
                                                        this.$Message.success('加急成功！');
                                                        this.changeTab('review');
                                                        this.getBages();
                                                    }
                                                }
                                            }).catch(error => {
                                                this.$Message.error(error.message);
                                            });
                                        }
                                    })
                                }
                            }
                        }, '加急')
                    ]);
                }
            },
            table_review_accelerate: {
                title: '操作',
                key: 'action',
                width: 150,
                align: 'center',
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    let transactionNum = params.row.stransactionnum;
                                    this.$Modal.confirm({
                                        title:'确认撤回流水号：'+params.row.stransactionnum+'？',
                                        content:'是否撤回流水号：'+params.row.stransactionnum+'的任务',
                                        onOk:() => {
                                            const data = {
                                                sapprovalstate: approval_state.APPROVAL_STATE_COMMERCE_NEW,
                                                stransactionnum:transactionNum
                                            };
                                            const params = {
                                                action:'call_back'
                                            };
                                            updateWorkIndexByApprovalState(data, params).then(response => {
                                                if (response.status == 200){
                                                    this.$Message.success('撤回成功！');
                                                    this.changeTab('review');
                                                    this.getBages();
                                                }
                                            }).catch(error => {
                                                this.$Message.error(error.message);
                                            });
                                        }
                                    })
                                }
                            }
                        }, '撤回')
                    ]);
                }
            },
            table_passed:{
                title: '下载/查看',
                key: 'action',
                width: 180,
                align: 'center',
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'success',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    const data = {
                                        'transactionNum': params.row.stransactionnum
                                    };
                                    getReceipt(data).then(response => {
                                        if (response.data){
                                            let url = window.URL.createObjectURL(new Blob([response.data]));
                                            let link = document.getElementById('receipt');
                                            link.style.display = 'none';
                                            link.href = url;
                                            link.target = '_blank'
                                            link.setAttribute('download', params.row.stransactionnum + '.doc');
                                            link.click();
                                            URL.revokeObjectURL(link.href);
                                        }
                                    }).catch(error => {
                                        this.$Message.error(error.message);
                                    });
                                }
                            }
                        }, '回执'),
                        h('Button', {
                            props: {
                                type: 'info',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    var ifUploadLicence = params.row.suploadlicence;

                                    if (ifUploadLicence === 0) {
                                        this.$Notice.warning({
                                            title: '未上传开户许可证！请等待！',
                                            desc: '未上传开户许可证！请等待！',
                                            duration: 3
                                        });
                                    } else if (ifUploadLicence === 1) {
                                        const data = {
                                            'transactionNum': params.row.stransactionnum
                                        };

                                        getLicenceImage(data).then(response => {
                                            if (response.status === 200){
                                                const content = 'data:image/jpg;base64,' + response.data.src;
                                                let blob = this.base64ToBlob(content); //new Blob([content]);
                                                let url = window.URL.createObjectURL(blob);
                                                let link = document.getElementById('receipt');
                                                link.style.display = 'none';
                                                link.href = url;
                                                link.target = '_blank'
                                                link.setAttribute('download', params.row.stransactionnum + '.jpg');
                                                link.click();
                                                URL.revokeObjectURL(link.href);
                                            }
                                        }).catch(error => {
                                            this.$Message.error(error.message);
                                        });
                                    }
                                }
                            }
                        }, '证书'),
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

                                    this.certificateType();

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
            table_complete:{
                title:'审核时间',
                key: 'scompletetimes'
            },
            table_endTime:{
                title:'提交时间',
                key: 'sendtime'
            },
            table_startTime:{
                title:'录入时间',
                key: 'sstarttime'
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

                                    this.certificateType();

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
            cropped_main: false, //判断是否已经剪裁
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
            certi_kind_list:[],
            file_type:{
                file_type:''
            },
            file_number:1,
            check_preview_info:'',
            businessList: [],
            accountTypeList: [],
            workIndex: {
                stransactionnum:'',
                sdepositorname:'',
                sbusinesscategory:'',
                saccounttype:'',
                sbankcode:'',
                sbankname:'',
                supusercode:'',
                supusername:'',
                sbusinessemergency: '0'
            },
            ifEdit:false,
            // newTaskForm:null,
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
            latestReview:'',
            img_hidden:false,
            breadCrumb:'',
            edit_Num: 0,
            returned_Num: 0,
            accelerate_Num: 0,
            ifSaved:false, //是否保存了申请书
            accelerated:false, //是否申请加急状态
            ifLook:false, //是否查看已通过的内容
            ifHasBankReview: false,
            certi_kind_validate: [],
            previewModalHeight: 0,
            previewModalWidth: 0
        };
    },
    components:{
        'my-src-image':{
            props:['imgfile','index'],
            data:function(){
                return {
                    id:'src-img-'+this.index,
                    file:this.imgfile
                };
            },
            render:function (createElement) {
                var url = null;
                if (window.createObjectURL != undefined) { // basic
                    url = window.createObjectURL(this.file);
                } else if (window.URL != undefined) { // mozilla(firefox)
                    url = window.URL.createObjectURL(this.file);
                } else if (window.webkitURL != undefined) { // webkit or chrome
                    url = window.webkitURL.createObjectURL(this.file);
                }

                return createElement('div',{
                    style:{
                        position: 'relative'
                    }
                },[
                    createElement('Icon',{
                        style:{
                            left: '38px',
                            top:'2px',
                            position: 'absolute',
                            fontSize: '5px',
                            color: 'red',
                            zIndex:'2'
                        },
                        attrs:{
                            type:'close-round'
                        },
                        nativeOn:{
                            '!click':this.deleteImg
                        }
                    }),
                    createElement('img' ,{
                        style:{
                            width:'50px',
                            height:'50px',
                            zIndex:'1'
                        },
                        attrs:{
                            id:this.id,
                            src:url
                        },
                        on:{
                            // "!contextmenu":this.deleteImg
                            '!click':this.prepareImage
                        }
                    })
                ]);
            },
            methods:{
                deleteImg:function () {
                    this.$emit('deleteImg', this.imgfile);
                },
                prepareImage:function () {
                    this.$emit('prepareImage', this.imgfile);
                }
            }
        },
        'my-dest-image':{
            props:['imgfile','index', 'ifLook'],
            data:function(){
                return {
                    id:'dest-img-'+this.index,
                    file:this.imgfile,
                    src:''
                };
            },
            render:function (createElement) {
                var image = document.getElementById(this.id);
                if (!this.imgfile.ifBase64 && image==null){
                    console.log(this.id);
                    let that = this;
                    getBase64Image({
                        path: this.imgfile.src
                    }).then(response => {
                        if (response.status == 200){
                            var image = document.getElementById(this.id);
                            image.src = 'data:image/jpg;base64,' + response.data.src;
                            this.src = image.src;

                            this.updateImgDestFiles({
                                src: image.src,
                                ifBase64:true,
                                index: this.index
                            });

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
                } else{
                    this.$nextTick(()=>{
                        if (image != null) {
                            image.src = this.src;
                        }
                    });
                }

                return createElement('div',{
                    style:{
                        position: 'relative'
                    }
                },[
                    createElement('Icon',{
                        style:{
                            left: '38px',
                            top:'2px',
                            position: 'absolute',
                            fontSize: '5px',
                            color: 'red',
                            zIndex:'2',
                            display:this.ifLook ? 'none' : 'block'
                        },
                        attrs:{
                            type:'close-round'
                        },
                        nativeOn:{
                            '!click':this.deleteImgFromDB
                        }
                    }),
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
                            '!click':this.showCheckModal
                        }
                    })
                ]);
            },
            methods:{
                deleteImgFromDB:function () {
                    this.$emit('deleteImgFromDB', this.imgfile);
                },
                showCheckModal:function () {
                    this.$emit('showCheckModal', {
                        imgfile: this.imgfile,
                        id: this.id
                    });
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
                this.workIndex.sbusinesscategory = '';
                this.workIndex.saccounttype = '';
                this.workIndex.sdepositorname = '';
                this.latestReview = '';
                // this.businessList = [];
                // this.accountTypeList = [];
                this.workIndex = {
                    stransactionnum:'',
                    sdepositorname:'',
                    sbusinesscategory: '',
                    saccounttype:'',
                    sbankcode:'',
                    sbankname:'',
                    supusercode:'',
                    supusername:'',
                    sbusinessemergency: '0'
                };
                this.src_img_files = [];
                this.dest_img_files = [];
                this.resetCropper();
                this.main_img_url = '';
                this.attachment_img_url = '';
                this.file_number = 1;
                this.ifSaved = false;
                this.accelerated = false;
                this.getBages();
                this.ifLook = false;
            }
        }
    },
    methods: {
        changeTab: function (name) {
            this.table_cols = [];
            [...this.table_cols] = this.table_default_cols;

            this.accelerated = false;

            switch (name){
                case 'edit':
                    this.tabSelected = approval_state.APPROVAL_STATE_COMMERCE_NEW;
                    this.breadCrumb = '待编辑';
                    this.table_cols.push(this.table_startTime);
                    this.table_cols.push(this.table_edit);
                    break;
                case 'review':
                    this.tabSelected = approval_state.APPROVAL_STATE_COMMERCE_REVIEW;
                    this.table_cols.push(this.table_review);
                    this.table_cols.push(this.table_startTime);
                    this.breadCrumb = '待复核';
                    break;
                case 'recheck':
                    this.tabSelected = approval_state.APPROVAL_STATE_PBC_CHECK;
                    this.breadCrumb = '待审核';
                    this.table_cols.push(this.table_startTime);
                    this.table_cols.push(this.table_endTime);
                    break;
                // case 'pass': this.tabSelected = 4;break;
                case 'passed':
                    this.tabSelected = approval_state.APPROVAL_STATE_PBC_PASS_AUDIT;
                    this.breadCrumb = '已通过';
                    this.table_cols.push(this.table_endTime);
                    this.table_cols.push(this.table_complete);
                    this.table_cols.push(this.table_passed);
                    break;
                case 'accelerate':
                    this.tabSelected = approval_state.APPROVAL_STATE_COMMERCE_REVIEW;
                    this.breadCrumb = '加速通道';
                    this.table_cols.push(this.table_review_accelerate);
                    this.accelerated = true;
                    break;
                case 'returned':
                    this.tabSelected = approval_state.APPROVAL_STATE_NO_PASS;
                    this.breadCrumb = '被退回';
                    this.table_cols.push(this.table_edit);
                    break;
                case 'stoped':
                    this.tabSelected = approval_state.APPROVAL_STATE_ERROR;
                    this.breadCrumb = '已终止';
                    this.table_cols.push(this.table_stoped);
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
                businessEmergency : this.tabSelected === 1 ? ( this.accelerated ? 1 : 0) : ''
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
                businessEmergency : this.tabSelected === 2 ? ( this.accelerated ? 1 : 0) : ''
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
        showCrop: function (type) {
            switch (type) {
                case 'main':
                    this.cropper_main.crop();
                    this.cropped_main = true;
                    break;
                case 'attachment':
                    this.cropper_attachment.crop();
                    this.cropped_attachment = true;
                    break;
            }
        },
        cropFinish: function (type) {
            var croppedCanvas;
            var imgUrl;

            switch (type) {
                case 'main':
                    croppedCanvas = this.cropper_main.getCroppedCanvas();
                    break;
                case 'attachment':
                    croppedCanvas = this.cropper_attachment.getCroppedCanvas();
                    break;
            }

            if (croppedCanvas) {
                imgUrl = croppedCanvas.toDataURL('image/jpeg', 0.92);
                // this.showPreivewModal(croppedCanvas, imgUrl, type);
                this.updateCropper(imgUrl, type);
            }
        },
        cropCancel: function (type) {
            switch (type) {
                case 'main':
                    this.cropper_main.clear();
                    this.cropped_main = false;
                    break;
                case 'attachment':
                    this.cropper_attachment.clear();
                    this.cropped_attachment = false;
                    break;
            }
        },
        /*显示框预览*/
        showPreviewModal: function (type, value) {
            let factor = 0.85;
            this.previewModalHeight = document.documentElement.clientHeight*factor + 'px';
            this.previewModalWidth = document.documentElement.clientHeight*0.7*factor + 'px';

            if (type == 'main'){
                this.file_type.file_type = '申请书';
            } else {
                this.file_type.file_type = value;
            }
            this.previewModal = true;

            var img = document.getElementById('image_preivew');
            var imgUrl = '';


            // if (type == 'main') {
            //     imgUrl = this.main_img_url;
            //     // this.showAttachSelect = false;
            // } else {
            //     imgUrl = this.attachment_img_url;
            //     // this.showAttachSelect = true;
            // }

            this.$nextTick(()=>{
                if (!this.cropper_preview) {
                    this.cropper_preview = new Cropper(img, {
                        aspectRatio: NaN,
                        ready: function () {

                        }
                    });
                }

                var croppedCanvas;
                // var imgUrl;

                switch (type) {
                    case 'main':
                        croppedCanvas = this.cropper_main.getCroppedCanvas();
                        break;
                    default:
                        croppedCanvas = this.cropper_attachment.getCroppedCanvas();
                        break;
                }

                //预览时压缩
                if (croppedCanvas) {
                    imgUrl = croppedCanvas.toDataURL('image/jpeg', 0.15);
                    // this.showPreivewModal(croppedCanvas, imgUrl, type);
                    // this.updateCropper(imgUrl, type);
                }

                this.cropper_preview.replace(imgUrl, false);

                img.alt = type;

                this.preview_img_url = imgUrl;
            });

        },
        showCheckModal: function (data) {
            let factor = 0.8;
            this.previewModalHeight = document.documentElement.clientHeight*factor + 'px';
            this.previewModalWidth = document.documentElement.clientHeight*0.7*factor + 'px';

            this.checkModal = true;
            var img = document.getElementById('image_check');
            var imgSrc = document.getElementById(data.id);
            var imgUrl = imgSrc.src;

            this.check_preview_info = data.imgfile.number + ' : ' + data.imgfile.type;

            this.$nextTick(() => {
                if (!this.cropper_check) {
                    this.cropper_check = new Cropper(img, {
                        aspectRatio: NaN,
                        ready: function () {

                        }
                    });
                }

                this.cropper_check.replace(imgUrl, false);
            });

            this.check_img_url = imgUrl;

        },
        /*上传文件*/
        uploadFile: function () {
            var uploadInput = document.getElementById('upload-input');
            // console.log("Property or method \"uploadfile\" is not defined on the instance but referenced during render. ");
            if (uploadInput) {
                uploadInput.click();
            }
        },
        uploadMultipleFile: function () {
            var uploadInput = document.getElementById('upload-multiple-input');
            // console.log("Property or method \"uploadfile\" is not defined on the instance but referenced during render. ");
            if (uploadInput) {
                uploadInput.click();
            }
        },
        handleFileChange(e) {
            let inputDOM = this.$refs.inputer_main;
            // 通过DOM取文件数据
            var file = inputDOM.files[0];
            this.errText = '';

            let size = Math.floor(file.size / 1024);
            if (size > 1024*5) {
                // 这里可以加个文件大小控制
                this.$Message.error('文件超过5MB！');
                return false;
            }

            // // 触发这个组件对象的input事件
            // this.$emit('input', this.file);
            //
            // // 这里就可以获取到文件的名字了
            // this.fileName = this.file.name;
            //
            // // 这里加个回调也是可以的
            // this.onChange && this.onChange(this.file, inputDOM.value);

            this.imgPreview(file, 'main');
            event.target.value='';
        },
        handleMultipleFileChange(event) {
            let inputDOM = this.$refs.inputer_attachment;
            // 通过DOM取文件数据
            for (var i = 0; i < inputDOM.files.length; ++i) {
                if (inputDOM.files[i].size > 1024*5){
                    this.src_img_files.push(inputDOM.files[i]);
                } else {
                    this.$Message.error('文件超过5MB！');
                }
            }

            // let size = Math.floor(this.file.size / 1024);
            // if (size > 2048) {
            //     // 这里可以加个文件大小控制
            //     return false
            // }
            //
            // // 触发这个组件对象的input事件
            // this.$emit('input', this.file);
            //
            // // 这里就可以获取到文件的名字了
            // this.fileName = this.file.name;
            //
            // // 这里加个回调也是可以的
            // this.onChange && this.onChange(this.file, inputDOM.value);

            // this.imgPreview(file, 'attachment');

            event.target.value='';
        },
        /*图片预览*/
        imgPreview(file, type) {
            let self = this;
            // 创建一个reader
            let reader = new FileReader();

            // 看支持不支持FileReader
            if (!file || !window.FileReader) return;

            if (/^image/.test(file.type)) {
                // 将图片将转成 base64 格式
                reader.readAsDataURL(file);
                // 读取成功后的回调
                reader.onloadend = function () {
                    self.updateCropper(this.result, type);
                };
            }
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
        transImage: function (file) {
            let self = this;
            // 看支持不支持FileReader
            if (!file || !window.FileReader) return;

            if (/^image/.test(file.type)) {
                // 创建一个reader
                var reader = new FileReader();
                // 将图片将转成 base64 格式
                reader.readAsDataURL(file);
            }

            reader.onloadend = function () {
                resolve(this.result);
            };
        },
        prepareImage: function (imgFile) {
            this.imgPreview(imgFile, 'attachment');
        },
        /*删除附件，此时文件未到服务器*/
        deleteImg: function (file) {
            this.$Modal.confirm({
                title: '是否删除',
                content: '确认删除该图片',
                onOk: () => {
                    let index = this.src_img_files.indexOf(file);
                    this.src_img_files.splice(index, 1);
                    this.$Message.info('删除成功');
                }, onCancel: () => {
                }
            });
        },
        /*删除服务器上保存的图片文件*/
        deleteImgFromDB: function (file) {
            this.$Modal.confirm({
                title: '是否删除',
                content: '确认删除该图片',
                onOk: () => {

                    deleteImage({
                        sID:file.sid
                    }).then(response => {
                        if (response.status == 200 && response.data == 1){

                            if (file.type === '申请书'){
                                this.ifSaved = false;
                            } else {

                                for (var i=0; i < this.certi_kind_validate.length; ++i){
                                    var fileName = this.certi_kind_validate[i].sProofName;
                                    if (file.type === fileName){
                                        --this.certi_kind_validate[i].sProofAmount;
                                        break;
                                    }
                                }
                            }

                            let index = this.dest_img_files.indexOf(file);
                            var deleteFile = this.dest_img_files.splice(index, 1);
                            let len = this.dest_img_files.length;
                            var number = new Number(deleteFile[0].number);

                            if (len > 0 && number != 0) {
                                var i = this.dest_img_files[0].number == '0000' ? number : number - 1;

                                for (; i < len; ++i) {
                                    this.dest_img_files[i].number = this.formatNumberToString(number);
                                    ++number;
                                }
                            }

                            if (this.file_number > 1) {
                                --this.file_number;
                            }

                            this.$Message.info('删除成功');
                        } else {
                            this.$Message.error('删除失败');
                        }
                    }).catch(error => {
                        this.$Message.error(error);
                    });


                },
                onCancel: () =>
            {
                }
            })
            ;
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
        /*预览框处理*/
        confirmUpload: function () {
            // if (this.showAttachSelect) {
            //     this.$refs.uploadImageForm.validate((valid) => {
            //         if (valid) {
            //             this.uploadImage();
            //         }
            //     });
            // } else {
                this.uploadImage();
            // }
        },
        uploadImage:function () {
            var imgUrl = this.preview_img_url;
            var number = '';

            // if (!this.showAttachSelect) {
            //     number = '0000';
            //     this.file_type.file_type = '申请书';
            //     if (this.dest_img_files.length >= 1 && this.dest_img_files[0].number == '0000') {
            //         this.dest_img_files.splice(0, 1);
            //     }
            // } else {
            //     number = this.formatNumberToString(this.file_number);
            // }

            if (this.file_type.file_type == '申请书') {
                number = '0000';
                if (this.dest_img_files.length >= 1 && this.dest_img_files[0].number == '0000') {
                    this.dest_img_files.splice(0, 1);
                }
            } else {
                number = this.formatNumberToString(this.file_number);
            }


            var  file_type = this.file_type.file_type;

            var blob = this.getBlobBydataURI(imgUrl, 'image/jpeg');

            var formData = new FormData();

            formData.append('transactionNum', this.workIndex.stransactionnum);
            formData.append('imageType', file_type == '申请书'? '0' : '1');
            formData.append('proofName', file_type);
            formData.append('imageOriginName', file_type);
            formData.append('imageSN', number);
            formData.append('imageFile', blob);

            uploadImage(formData).then(response => {
                if (response.status == 200){
                    var config = {
                        ifBase64: true,
                        src: imgUrl,
                        type: file_type,
                        number: number,
                        date: Date().toString(),
                        sid: response.data
                    };

                    if (file_type != '申请书') {
                        //尾插
                        this.dest_img_files.push(config);
                        ++this.file_number;

                        for (var i=0; i < this.certi_kind_validate.length; ++i){
                            var fileName = this.certi_kind_validate[i].sProofName;
                            if (file_type === fileName){
                                ++this.certi_kind_validate[i].sProofAmount;
                                break;
                            }
                        }
                    } else {
                        //头插
                        this.dest_img_files.unshift(config);
                        this.ifSaved = true;
                    }

                    this.$Message.success('上传成功！');
                    this.previewModal = false;

                } else if (response.status == 500){
                    this.$Message.error(response.message);
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });

            //清空选择的文件类型
            this.file_type.file_type = '';
        },
        getBlobBydataURI: function (dataURI,type) {
            var binary = atob(dataURI.split(',')[1]);
            var array = [];
            for(var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type:type });
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
        cancelUpoad: function () {
            this.previewModal = false;
            this.file_type.file_type = '';
        },
        /*新建任务弹出框*/
        newTask:function(){
            this.initTransactionInfo();
            this.newTaskModal = true;
        },
        confirmNewTask:function(){
            this.$refs.newTaskForm.validate((valid)=>{
                if (valid){
                    this.createNewTask();
                }
            });
        },
        cancelNewTask:function(){
            this.newTaskModal = false;
        },
        certificateType:function () {

            certificateType(this.workIndex.sbusinesscategory, this.workIndex.saccounttype).then(response => {
                if (response.status == 200){
                    const data = response.data;

                    this.certi_kind_validate = [];

                    for (var i=0; i<data.length; ++i){
                        var config = {
                            'sProofName': data[i].sProofName,
                            'sProofAmount': 0
                        };
                        this.certi_kind_validate.push(config);
                    }

                    this.certi_kind_list = data;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        createNewTask:function () {
            workIndex({
                sdepositorname:this.workIndex.sdepositorname,
                sbusinesscategory:this.workIndex.sbusinesscategory,
                saccounttype:this.workIndex.saccounttype
            }).then((response)=>{
                if(response.status == '200'){
                    this.newTaskModal = false;
                    this.ifEdit = true;
                    this.workIndex = response.data;
                } else{
                    console.log(response.body);
                }
            }).catch((error)=>{
                console.log(error);
            });

            this.certificateType();
        },
        /*初始化编辑界面*/
        initTransactionInfo: function () {

            basicCategory().then((response)=>{
                if(response.status == '200'){
                    this.businessList = response.data;
                }
            }).catch((error)=>{
                this.$Message.error(error.message);
            });

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

                            for (var j=0; j < this.certi_kind_validate.length; ++j){
                                var fileName = this.certi_kind_validate[j].sProofName;
                                if (data[i].sproofname === fileName){
                                    ++this.certi_kind_validate[j].sProofAmount;
                                    break;
                                }
                            }
                        } else {
                            //头插
                            this.dest_img_files.unshift(config);
                            this.ifSaved = true;
                        }
                    }
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        /**/
        getWorkIndexes:function () {
            workIndexes().then(response => {
                this.table_list = response.data;
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        updateWorkIndexByDepositor:function () {
            this.$Modal.confirm({
                title: '请求确认',
                content: '是否保存更改？',
                onOk: () => {
                    updateWorkIndexByDepositor({
                        sdepositorname: this.workIndex.sdepositorname,
                        stransactionnum: this.workIndex.stransactionnum
                    }).then(response => {
                        if (response.status == 200){
                            this.$Message.info('任务保存成功！');
                        }
                    }).catch(error => {
                        this.$Message.info(error.message);
                    });

                }, onCancel: () => {
                }
            });
        },
        commitWorkIndexByApprovalState:function (type) {
            var textList = this.commitValidate();
            // alert(textList);
            if (textList !== ''){
                this.$Notice.error({
                    title: '文件数量错误',
                    desc: textList,
                    duration: 15
                });
            } else {
                if (type === 'ren'){
                    this.$Modal.confirm({
                        title: '提交确认',
                        content: '是否确认提交至人民银行？',
                        onOk: () => {
                            const data = {
                                sapprovalstate: approval_state.APPROVAL_STATE_PBC_CHECK,
                                stransactionnum: this.workIndex.stransactionnum,
                                sbusinessemergency: this.workIndex.sbusinessemergency
                            };
                            const params = {
                                action:'commit_ren'
                            };
                            updateWorkIndexByApprovalState(data, params).then(response => {
                                if (response.status == 200){
                                    this.$Message.info('任务已提交至人民银行！');
                                    this.ifEdit = false;
                                    this.changeTab('edit');
                                }
                            }).catch(error => {
                                this.$Message.info(error.message);
                            });

                        }, onCancel: () => {
                        }
                    });
                } else {
                    this.$Modal.confirm({
                        title: '提交确认',
                        content: '是否确认提交至复核员？',
                        onOk: () => {
                            const data = {
                                sapprovalstate: approval_state.APPROVAL_STATE_COMMERCE_REVIEW,
                                stransactionnum: this.workIndex.stransactionnum,
                                sbusinessemergency: this.workIndex.sbusinessemergency
                            };
                            const params = {
                                action:'commit'
                            };
                            updateWorkIndexByApprovalState(data, params).then(response => {
                                if (response.status == 200){
                                    this.$Message.info('任务已提交至复审员！');
                                    this.ifEdit = false;
                                    this.changeTab('edit');
                                }
                            }).catch(error => {
                                this.$Message.info(error.message);
                            });

                        }, onCancel: () => {
                        }
                    });
                }
            }

        },
        initCropper:function () {
            var image_main = document.getElementById('image_main');
            var image_attachment = document.getElementById('image_attachment');

            //初始化申请书编辑区
            this.cropper_main = new Cropper(image_main, {
                aspectRatio: NaN,
                ready: function () {

                }
            });
            //初始化附件编辑区
            this.cropper_attachment = new Cropper(image_attachment, {
                aspectRatio: NaN,
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
                aspectRatio: NaN,
                ready: function () {

                }
            });

            //初始化附件编辑区
            this.cropper_attachment = new Cropper(image_attachment, {
                aspectRatio: NaN,
                ready: function () {

                }
            });
        },
        getBages:function () {
            //edit
            getworkIndexNum({
                approvalState: approval_state.APPROVAL_STATE_COMMERCE_NEW,
                businessEmergency: ''
            }).then(response => {
                if (response.status == 200){
                    this.edit_Num = response.data;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });

            //return
            getworkIndexNum({
                approvalState: approval_state.APPROVAL_STATE_NO_PASS,
                businessEmergency: ''
            }).then(response => {
                if (response.status == 200){
                    this.returned_Num = response.data;
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
        },
        updateImgDestFiles:function (data) {
            if (this.dest_img_files[data.index] != null) {
                this.dest_img_files[data.index].src = data.src;
                this.dest_img_files[data.index].ifBase64 = true;
            }
        },
        onSelectOpinions:function (name) {
            // alert(name);
            let result = name.split(':');
            this.workIndex.sbusinesscategory = result[0];
            this.workIndex.saccounttype = result[1];
            this.newTaskModal = true;
        },
        showLatestReview:function () {
            // alert(this.latestReview);
            this.$Notice.error({
                title: '退回理由',
                desc: this.latestReview,
                duration: 15
            });
        },
        bankReviewCheck:function () {

            bankReviewCheck().then(response => {
                if (response.status == 200){
                    const flag = response.data.ifBankEntryHasBankReview;

                    if (flag === 'true') {
                        this.ifHasBankReview = true;
                    } else {
                        this.ifHasBankReview = false;
                    }
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        //提交验证
        commitValidate:function () {
            var list = '';

            if (this.dest_img_files.length !== 0 && this.dest_img_files[0].number !== '0000') {
                list = '申请书未上传！；';
            }

            for (var i=0; i< this.certi_kind_validate.length; ++i){
                var count = parseInt(this.certi_kind_list[i].sProofAmount);

                if (count !== 3) {

                    if (count === 1) {
                        if (this.certi_kind_validate[i].sProofAmount !== count){
                            var text = this.certi_kind_validate[i].sProofName + '：' + '已上传' + this.certi_kind_validate[i].sProofAmount
                                + '张，应上传' + count + '张';

                            list = list + text + '；' + '\n';
                        }
                    } else if (count === 2) {
                        if (this.certi_kind_validate[i].sProofAmount < 1){
                            var text = this.certi_kind_validate[i].sProofName + '：' + '已上传' + this.certi_kind_validate[i].sProofAmount
                                + '张，应上传不少于1张';

                            list = list + text + '；' + '\n';
                        }
                    }


                }
            }

            return list;
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
        },
        returnBack:function () {
            this.changePage();
            this.ifEdit = false;
            this.ifLook = false;
        }
    },
    mounted:function () {
        this.$nextTick(() => {
            this.changeTab('edit');
        });

        this.initCropper();
        this.getBages();
        this.initTransactionInfo();
        this.bankReviewCheck();
    }
};
