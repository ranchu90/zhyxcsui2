import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import {
    workIndexes,
    workIndexesWithPage,
    updateWorkIndexByApprovalState,
    updateWorkIndexByApprovalCodeAndIdentifier,
    getworkIndexNum
} from '../api/workindex';
import {getImages, getBase64Image} from '../api/image';
import {getReview, insertReview} from '../api/approval_record';
import {uploadLicenceImage, deleteLicenceImage, getLicenceImage} from '../api/licence';
import review_opinions from '../constant/review_opinion';
import approval_state from "../constant/approval_state";

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
            table_recheck: {
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
                        }, '审核')
                    ]);
                }
            },
            table_passed: {
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
                                    this.ifUpload = true;
                                    this.getSavedLicenceImage();
                                    //动态设置图片列表的高度
                                    this.$nextTick(()=>{
                                        if (this.$refs.attachment) {
                                            this.img_list_height = this.$refs.certi.clientHeight;
                                        }
                                    });
                                }
                            }
                        }, '上传许可证')
                    ]);
                }
            },
            table_pass: {
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
                        }, '查看详情')
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
            cropped_main: false,
            cropped_attachment: false,
            cropper_main:null,
            cropper_attachment: null,
            cropper_preview:null,
            cropper_check:null,
            src_img_files:[],
            check_img_files:[],
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
                sapprovalcode:'',
                sidentifier:''
            },
            ifEdit: false,
            ifUpload: false,
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
            tabSelected: 1,
            recheck: '',
            img_hidden: false,
            certi_img_url:'',
            cropped_certi:false,
            cropper_certi:null,
            ifSaved:false,
            breadCrumb:'',
            reviewOpinion:review_opinions,
            accelerated:false,
            passed_Num:0,
            recheck_Num:0,
            ifUploadLicense: null,
            ifRecheck: null
        };
    },
    components:{
        'my-check-image':{
            props:['imgfile','index'],
            data:function(){
                return {
                    id:'dest-img-'+this.index,
                    file:this.imgfile
                };
            },
            render:function (createElement) {

                if (!this.imgfile.ifBase64){
                    getBase64Image({
                        path: this.imgfile.src
                    }).then(response => {
                        if (response.status == 200){
                            var image = document.getElementById(this.id);
                            image.src = 'data:image/jpg;base64,' + response.data.src;
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
                            src:this.file.src
                        },
                        on:{
                            '!click':this.prepareImage
                        }
                    })
                ]);
            },
            methods:{
                deleteImgFromDB:function () {
                    this.$emit('deleteImgFromDB', this.imgfile);
                },
                prepareImage:function () {
                    this.$emit('prepareImage', this.id);
                }
            }
        },
        'my-dest-image':{
            props:['imgfile','index'],
            data:function(){
                return {
                    id:'dest-img-'+this.index,
                    file:this.imgfile
                };
            },
            render:function (createElement) {

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
                            src:this.file.src
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
                        imgfile:this.imgfile,
                        id:this.id
                    });
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
                this.check_img_files = [];
                this.dest_img_files = [];
                this.resetCropper();
                this.main_img_url = '';
                this.attachment_img_url = '';
                this.recheck = '';
                this.file_number = 1;
                this.ifSaved = false;
                this.getBages();
            }
        },
        ifUpload:function () {
            if (!this.ifUpload){
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
                this.check_img_files = [];
                this.dest_img_files = [];
                this.resetCropper();
                this.main_img_url = '';
                this.attachment_img_url = '';
                this.recheck = '';
                this.file_number = 1;
                this.ifSaved = false;
            }
        }
    },
    methods: {
        changeTab: function (name) {
            this.table_cols = [];
            [...this.table_cols] = this.table_default_cols;

            this.accelerated = false;

            switch (name){
                case 'passed':
                    this.tabSelected = approval_state.APPROVAL_STATE_PBC_PASS_AUDIT;
                    this.table_cols.push(this.table_passed);
                    this.breadCrumb = '待传证';
                    this.ifUploadLicense = null;
                    this.ifRecheck = null;
                    break;
                case 'recheck':
                    this.tabSelected = approval_state.APPROVAL_STATE_PBC_PASS_AUDIT;
                    this.table_cols.push(this.table_pass);
                    this.breadCrumb = '待复审';
                    this.ifUploadLicense = 'true';
                    this.ifRecheck = null;
                    break;
                case 'final':
                    this.tabSelected = approval_state.APPROVAL_STATE_PBC_PASS_AUDIT;
                    this.table_cols.push(this.table_pass);
                    this.ifUploadLicense = 'true';
                    this.ifRecheck = 'true';
                    this.breadCrumb = '已结束';
                    break;
                case 'stoped':
                    this.tabSelected = approval_state.APPROVAL_STATE_ERROR;
                    this.breadCrumb = '已终止';
                    this.table_cols.push(this.table_stoped);
                    this.ifUploadLicense = null;
                    this.ifRecheck = null;
                    break;
            }

            if (this.ifEdit){
                this.ifEdit = false;
            }

            if ((this.ifUpload)){
                this.ifUpload = false;
            }

            this.changePage();
        },
        changePage:function (page) {
            this.table_loading = true;

            if (page != null){
                this.currentPage = page;
            }

            var data;

            if (this.tabSelected !== approval_state.APPROVAL_STATE_ERROR) {
                data = {
                    pageSize: this.pageSize,
                    currentPage: this.currentPage,
                    approvalState: this.tabSelected,
                    businessEmergency : '',
                    ifUploadLicense: this.ifUploadLicense,
                    ifRecheck: this.ifRecheck
                };
            } else {
                data = {
                    pageSize: this.pageSize,
                    currentPage: this.currentPage,
                    approvalState: this.tabSelected,
                    businessEmergency : ''
                };
            }

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

            var data;

            if (this.tabSelected !== approval_state.APPROVAL_STATE_ERROR) {
                data = {
                    pageSize: this.pageSize,
                    currentPage: this.currentPage,
                    approvalState: this.tabSelected,
                    businessEmergency : '',
                    ifUploadLicense: this.ifUploadLicense,
                    ifRecheck: this.ifRecheck
                };
            } else {
                data = {
                    pageSize: this.pageSize,
                    currentPage: this.currentPage,
                    approvalState: this.tabSelected,
                    businessEmergency : ''
                };
            }

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
                case 'certi':
                    this.cropper_certi.zoom(name);
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
                case 'certi':
                    this.cropper_certi.rotate(90);
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
                case 'certi':
                    this.cropper_certi.crop();
                    this.cropped_certi = true;
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
                case 'certi':
                    croppedCanvas = this.cropper_certi.getCroppedCanvas();
                    break;
            }

            if (croppedCanvas) {
                imgUrl = croppedCanvas.toDataURL('image/jpeg', 1.0);
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
                case 'certi':
                    this.cropper_certi.clear();
                    this.cropped_certi = false;
                    break;
            }
        },
        /*显示框预览*/
        showPreviewModal: function (type) {
            this.previewModal = true;

            var img = document.getElementById('image_preivew');
            var imgUrl = this.certi_img_url;

            this.$nextTick(()=>{
                if (!this.cropper_preview) {
                    this.cropper_preview = new Cropper(img, {
                        aspectRatio: NaN,
                        ready: function () {

                        }
                    });
                }

                this.cropper_preview.replace(imgUrl, false);
            });

            img.alt = type;

            this.preview_img_url = imgUrl;

        },
        /*上传文件*/
        uploadFile: function () {
            var uploadInput = document.getElementById('upload-input');
            // console.log("Property or method \"uploadfile\" is not defined on the instance but referenced during render. ");
            if (uploadInput) {
                uploadInput.click();
            }
        },
        handleFileChange(e) {
            let inputDOM = this.$refs.inputer_certi;
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

            this.imgPreview(file, 'certi');
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
        showCheckModal: function (data) {
            this.checkModal = true;
            var img = document.getElementById('image_check');
            var imgSrc = document.getElementById(data.id);
            var imgUrl = imgSrc.src;
            img.src = imgUrl;

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
                    break;
                case 'certi':
                    this.cropper_certi.replace(url, false);
                    this.certi_img_url = url;
                    this.cropped_certi = false;
                    break;
            }
        },
        prepareImage: function (id) {
            var image = document.getElementById(id);

            this.updateCropper(image.src, 'attachment');
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
                    this.check_img_files = [];

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
                            this.check_img_files.push(config);
                            ++this.file_number;

                            if (config.number == '0001') {
                                getBase64Image({
                                    path: data[i].sstorepath
                                }).then(response => {
                                    if (response.status == 200){
                                        var image = 'data:image/jpg;base64,' + response.data.src;
                                        this.updateCropper(image, 'attachment');
                                    }
                                }).catch(error => {
                                    this.$Message.error(error.message);
                                });
                            }
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
        getSavedLicenceImage:function () {
            const data = {
                transactionNum: this.workIndex.stransactionnum
            }
            getLicenceImage(data).then(response => {
                if (response.status == 200){
                    const data = response.data;
                    if (data.src != null){
                        var imgUrl = 'data:image/jpg;base64,' + data.src;
                        var config = {
                            src: imgUrl,
                            type: '许可证',
                            number: '0000',
                            date: Date().toString(),
                            transactionNum: this.workIndex.stransactionnum
                        };
                        this.dest_img_files.push(config);
                        this.cropper_certi.replace(imgUrl, false);
                        this.ifSaved = true;
                    }
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        /*分页数据*/
        getWorkIndexes:function () {
            workIndexes().then(response => {
                this.table_list = response.data;
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        updateWorkIndexByLicence:function () {
            this.$Modal.confirm({
                title: '确认上传',
                content: '是否确认上传许可证？',
                onOk: () => {
                    const data = {
                        sapprovalstate: approval_state.APPROVAL_STATE_PBC_PASS_AUDIT,
                        stransactionnum: this.workIndex.stransactionnum
                    };

                    const  params = {
                        action: 'upload_licence'
                    }

                    updateWorkIndexByApprovalState(data, params).then(response => {
                        if (response.status == 200){
                            this.$Message.info('许可证已上传！');
                            this.ifUpload = false;
                            this.changeTab('passed');
                        }
                    }).catch(error => {
                        this.$Message.info(error.message);
                    });
                }, onCancel: () => {

                }
            });
        },
        // updateWorkIndexByApprovalStateBack:function () {
        //     this.$Modal.confirm({
        //         title: '退回确认',
        //         content: '是否确认退回至商业银行录入员？',
        //         onOk: () => {
        //             const data = {
        //                 sapprovalstate: approval_state.APPROVAL_STATE_NO_PASS,
        //                 stransactionnum: this.workIndex.stransactionnum,
        //                 sreturntimes: this.workIndex.sreturntimes
        //             };
        //             const params = {
        //                 action:'send_back'
        //             };
        //
        //             updateWorkIndexByApprovalState(data, params).then(response => {
        //                 if (response.status == 200){
        //                     this.$Message.info('任务已退回至商业银行录入员！');
        //                     this.ifEdit = false;
        //                     this.updateWorkIndexReview('审核未通过');
        //                 }
        //             }).catch(error => {
        //                 this.$Message.info(error.message);
        //             });
        //
        //         }, onCancel: () => {
        //         }
        //     });
        // },
        updateWorkIndexByApprovalStatePass:function () {
            this.$Modal.confirm({
                title: '提交意见',
                content: '是否确认提交意见？',
                onOk: () => {
                    updateWorkIndexByApprovalCodeAndIdentifier({
                        stransactionnum: this.workIndex.stransactionnum,
                        sapprovalcode: this.workIndex.sapprovalcode,
                        sidentifier: this.workIndex.sidentifier
                    }).then(response => {
                        if (response.status == 200) {
                            const data = {
                                sapprovalstate: approval_state.APPROVAL_STATE_PBC_PASS_AUDIT,
                                stransactionnum: this.workIndex.stransactionnum,
                                srecheckresult: '已合格',
                                srecheckopinion: this.recheck
                            };
                            const params = {
                                action:'recheck'
                            };

                            updateWorkIndexByApprovalState(data, params).then(response => {
                                if (response.status == 200){
                                    this.$Message.info('意见已提交！');
                                    this.ifEdit = false;
                                    this.updateWorkIndexReview('审核已通过');
                                }
                            }).catch(error => {
                                this.$Message.info(error.message);
                            });
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
                sapprovelopinion: this.recheck
            }).then(response => {
                if (response.status == 200){
                    this.$Message.info('复审意见已提交！');
                    this.ifEdit = false;
                    this.changeTab('recheck');
                }
            }).catch(error => {
                this.$Message.info(error.message);
            });
        },
        initCropper:function () {
            var image_main = document.getElementById('image_main');
            var image_attachment = document.getElementById('image_attachment');
            var image_certi = document.getElementById('image_certi');

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
            //
            this.cropper_certi = new Cropper(image_certi, {
                aspectRatio: NaN,
                ready: function () {

                }
            });
        },
        resetCropper:function () {
            this.cropper_main.destroy();
            this.cropper_attachment.destroy();
            this.cropper_certi.destroy();

            this.initCropper();
        },
        /*预览框处理*/
        confirmUpload: function () {
            this.uploadImage();
        },
        cancelUpoad: function () {
            this.previewModal = false;
            this.file_type.file_type = '';
        },
        uploadImage:function () {
            var imgUrl = this.preview_img_url;

            var blob = this.getBlobBydataURI(imgUrl, 'image/jpeg');

            var formData = new FormData();

            formData.append('transactionNum', this.workIndex.stransactionnum);
            formData.append('approvalCode', this.workIndex.sapprovalcode);
            formData.append('identifier', this.workIndex.sidentifier);
            formData.append('businessCategory', this.workIndex.sbusinesscategory);
            formData.append('accountType', this.workIndex.saccounttype);
            formData.append('bankCode', this.workIndex.sbankcode);
            formData.append('bankName', this.workIndex.sbankname);
            formData.append('licenceImage', blob);

            uploadLicenceImage(formData).then(response => {
                if (response.status == 200){

                    var config = {
                        src: imgUrl,
                        type: '许可证',
                        number: '0000',
                        date: Date().toString(),
                        transactionNum: this.workIndex.stransactionnum
                    };

                    this.dest_img_files.push(config);
                    this.previewModal = false;
                    this.ifSaved = true;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });

        },
        deleteImgFromDB:function (file) {
            const data = {
                transactionNum: file.transactionNum
            };

            this.$Modal.confirm({
                title:'确认删除',
                content:'是否删除该照片？',
                onOk:()=>{
                    deleteLicenceImage(data).then(response => {
                        if (response.status === 200){
                            if (response.data === 1){
                                this.$Message.success('图片删除成功！');
                                this.dest_img_files = [];
                                this.ifSaved = false;
                                this.certi_img_url = '';
                                this.resetCropper();
                            }
                        }
                    }).catch(error => {
                        this.$Message.error(error.message);
                    });
                }
            });
        },
        getBlobBydataURI: function (dataURI,type) {
            var binary = atob(dataURI.split(',')[1]);
            var array = [];
            for(var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type:type });
        },
        lookUpLicence:function () {
            getLicenceImage({
                transactionNum: this.workIndex.stransactionnum
            }).then(response => {
                if (response.status == 200){
                    const data = response.data;
                    if (data.src != null) {
                        var imgUrl = 'data:image/jpg;base64,' + data.src;
                        this.checkModal = true;
                        var img = document.getElementById('image_check')
                        img.src = imgUrl;

                        this.check_preview_info = '许可证';

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
                    }
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        /*审批意见预设意见响应*/
        onSelectOpinions:function (name) {
            this.recheck += this.reviewOpinion[name];
        },
        getBages:function () {
            //passed
            getworkIndexNum({
                approvalState: approval_state.APPROVAL_STATE_PBC_PASS_AUDIT,
                businessEmergency: ''
            }).then(response => {
                if (response.status == 200){
                    this.passed_Num = response.data;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });

            //recheckednp
            getworkIndexNum({
                approvalState: approval_state.APPROVAL_STATE_PBC_PASS_AUDIT,
                businessEmergency: '',
                ifUploadLicense: 'true',
                ifRecheck: null
            }).then(response => {
                if (response.status == 200){
                    this.recheck_Num = response.data;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        }
    },
    mounted:function () {
        this.$nextTick(() => {
            this.changeTab('passed');
        });

        this.initCropper();
        this.getBages();
    }
};
