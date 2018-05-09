import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import {workIndex, workIndexes, updateWorkIndexByDepositor, updateWorkIndexByApprovalState, deleteWorkIndex, workIndexesWithPage} from '../api/workindex';
import {accountType, businessCategory, certificateType} from '../api/image_standard';
import {uploadImage, deleteImage, getImages, getBase64Image} from '../api/image';
import {getReview} from '../api/approval_record';

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
                                                }
                                            }).catch(error => {
                                                this.$Message.error(error.message);
                                            });
                                        }
                                    })
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
                            on: {
                                click: () => {
                                    this.$Modal.confirm({
                                        title:'确认撤回流水号：'+params.row.stransactionnum+'？',
                                        content:'是否撤回流水号：'+params.row.stransactionnum+'的任务',
                                        onOk:() => {
                                            var data = {
                                                sapprovalstate: 1,
                                                stransactionnum:params.row.stransactionnum
                                            }
                                            updateWorkIndexByApprovalState(data).then(response => {
                                                if (response.status == 200){
                                                    this.$Message.success('撤回成功！');
                                                    this.changeTab('review');
                                                }
                                            }).catch(error => {
                                                this.$Message.error(error.message);
                                            });
                                        }
                                    })
                                }
                            }
                        }, '撤回修改')
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
                supusername:''
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
            img_hidden:false
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
            }
        }
    },
    methods: {
        changeTab: function (name) {
            this.table_cols = [];
            [...this.table_cols] = this.table_default_cols;

            switch (name){
                case 'edit': this.tabSelected = 1; this.table_cols.push(this.table_edit); break;
                case 'review': this.tabSelected = 2; this.table_cols.push(this.table_review); break;
                case 'recheck': this.tabSelected = 3;break;
                // case 'pass': this.tabSelected = 4;break;
                case 'passed': this.tabSelected = 4;break;
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
                currentPage: (this.currentPage -1)*this.pageSize,
                approvalState: this.tabSelected
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
                currentPage: (this.currentPage -1)*this.pageSize,
                approvalState: this.tabSelected
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
            }
        },
        /*显示框预览*/
        showPreviewModal: function (type) {
            this.previewModal = true;

            var img = document.getElementById('image_preivew');
            var imgUrl = '';


            if (type == 'main') {
                imgUrl = this.main_img_url;
                this.showAttachSelect = false;
            } else {
                imgUrl = this.attachment_img_url;
                this.showAttachSelect = true;
            }

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
        showCheckModal: function (data) {
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
                        if (response.status == 200){
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
        /*预览框处理*/
        confirmUpload: function () {
            if (this.showAttachSelect) {
                this.$refs.uploadImageForm.validate((valid) => {
                    if (valid) {
                        this.uploadImage();
                    }
                });
            } else {
                this.uploadImage();
            }
        },
        uploadImage:function () {
            var imgUrl = this.preview_img_url;
            var number = '';

            if (!this.showAttachSelect) {
                number = '0000';
                this.file_type.file_type = '申请书';
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
                    } else {
                        //头插
                        this.dest_img_files.unshift(config);
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
            var params = {
                businessCatagory:this.workIndex.sbusinesscategory,
                accountType:this.workIndex.saccounttype
            }
            certificateType(params).then(response => {
                if (response.status == 200){
                    const data = response.data;
                    var list = [];

                    for (var i=0; i<data.length; ++i){
                        var config = {
                            value: data[i],
                            label: data[i]
                        };
                        list.push(config);
                    }

                    this.certi_kind_list = list;
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
            businessCategory().then((response)=>{
                if(response.status == '200'){
                    var cates = response.data;
                    for (var i=0; i<cates.length; ++i){
                        this.businessList.push({
                            value:cates[i].toString(),
                            label:cates[i].toString()
                        });
                    }
                }
            }).catch((error)=>{
                this.$Message.error(error.message);
            });

            accountType().then((response)=>{
                if(response.status == '200'){
                    var types = response.data;
                    for (var i=0; i<types.length; ++i){
                        this.accountTypeList.push({
                            value:types[i].toString(),
                            label:types[i].toString()
                        });
                    }
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
                        } else {
                            //头插
                            this.dest_img_files.unshift(config);
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
        updateWorkIndexByApprovalState:function () {
            this.$Modal.confirm({
                title: '提交确认',
                content: '是否确认提交至复核员？',
                onOk: () => {
                    updateWorkIndexByApprovalState({
                        sapprovalstate: 2,
                        stransactionnum: this.workIndex.stransactionnum
                    }).then(response => {
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
        }
    },
    mounted:function () {
        this.$nextTick(() => {
            this.changeTab('edit');
        });

        this.initCropper();
    }
};
