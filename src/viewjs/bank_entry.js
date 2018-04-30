import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

Cropper.setDefaults({
    viewMode:1,
    dragMode:'move',
    autoCrop: false
});

export default {
    data () {
        return {
            table_cols: [
                {
                    type:'index',
                    align:'center',
                    width:60  
                },
                {
                    title: '流水号',
                    key: 'sTransactionNum'
                },
                {
                    title: '存款人名称',
                    key: 'sDepositorName'
                },
                {
                    title: '审批状态',
                    key: 'sApprovalState'
                },
                {
                    title: '业务类别',
                    key: 'sBusinessCategory'
                },
                {
                    title: '账户种类',
                    key: 'sAccountType'
                },
                {
                    title:'开户银行机构代码',
                    key: 'sBankCode'
                },
                {
                    title:'开户银行机构名称',
                    key: 'sBankName'
                },
                {
                    title:'录入开始时间',
                    key: 'sStartTime'
                },
                {
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
                                        this.show(params.index);
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
                                        this.remove(params.index);
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }
            ],
            table_list: [{
                sTransactionNum:'201804320001',
                sDepositorName:'中国人民银行湘西自治州中心支行',
                sApprovalState:'编辑',
                sBusinessCategory:'开户',
                sAccountType:'预算管理类单位基本存款户',
                sBankCode:'CBK9982391823',
                sBankName:'中国银行吉首市火车站支行',
                sStartTime:'2018-04-25 14:32'
            },{
                sTransactionNum:'201804320001',
                sDepositorName:'中国人民银行湘西自治州中心支行',
                sApprovalState:'编辑',
                sBusinessCategory:'开户',
                sAccountType:'预算管理类单位基本存款户',
                sBankCode:'CBK9982391823',
                sBankName:'中国银行吉首市火车站支行',
                sStartTime:'2018-04-25 14:32'
            },{
                sTransactionNum:'201804320001',
                sDepositorName:'中国人民银行湘西自治州中心支行',
                sApprovalState:'编辑',
                sBusinessCategory:'开户',
                sAccountType:'预算管理类单位基本存款户',
                sBankCode:'CBK9982391823',
                sBankName:'中国银行吉首市火车站支行',
                sStartTime:'2018-04-25 14:32'
            },{
                sTransactionNum:'201804320001',
                sDepositorName:'中国人民银行湘西自治州中心支行',
                sApprovalState:'编辑',
                sBusinessCategory:'开户',
                sAccountType:'预算管理类单位基本存款户',
                sBankCode:'CBK9982391823',
                sBankName:'中国银行吉首市火车站支行',
                sStartTime:'2018-04-25 14:32'
            },{
                sTransactionNum:'201804320001',
                sDepositorName:'中国人民银行湘西自治州中心支行',
                sApprovalState:'编辑',
                sBusinessCategory:'开户',
                sAccountType:'预算管理类单位基本存款户',
                sBankCode:'CBK9982391823',
                sBankName:'中国银行吉首市火车站支行',
                sStartTime:'2018-04-25 14:32'
            }], 
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
            file_type:'',
            file_number:1,
            check_preview_info:'',
            // user_info:{
            //     name:"录入员", 
            //         unit:"中国银行"
            // },
            page_status:'待编辑', 
            businessList: [],
            accountTypeList: [],
            businessCategory:'',
            accountType:'',
            workIndex: {
                sTransactionNum:'',
                sDepositorName:'',
                sBusinessCategory:'',
                sAccountType:'',
                sBankCode:'987984738223',
                sBankName:'中国银行湘西火车站分行',
                sUpUserCode:'029282',
                sUpUserName:'Lily'
            },
            ifEdit:false
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
                deleteImg:function (event) {
                    this.$emit('deleteImg', this.imgfile);
                },
                prepareImage:function (event) {
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
                            // "!contextmenu":this.deleteImg
                            '!click':this.showCheckModal
                        }
                    })
                ]);
            },
            methods:{
                deleteImgFromDB:function (event) {
                    this.$emit('deleteImgFromDB', this.imgfile);
                },
                showCheckModal:function (event) {
                    this.$emit('showCheckModal', this.imgfile);
                }
            }
        }
    },
    methods: {
        /*查询*/
        GetNewData: function () {
            this.$http.get('/user/getAll').then(response => {
                console.log(response.data);
            // get body data
                this.data1 = response.data;
            }, response =>
            {
                console.log(response.body);
            }
        );
        },
        changeData: function (name) {
            console.log(name);
            // switch (name){
            //     case '1':console.log('1');break;
            //     case '2':console.log('2');break;
            //     case '3':console.log('3');break;
            // } 
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
        showPreviewModal: function (type) {
            var img = document.getElementById('image_preivew');
            var imgUrl = '';

            if (type == 'main') {
                imgUrl = this.main_img_url;
                this.showAttachSelect = false;
            } else {
                imgUrl = this.attachment_img_url;
                this.showAttachSelect = true;
            }

            if (!this.cropper_preview) {
                this.cropper_preview = new Cropper(img, {
                    aspectRatio: NaN,
                    ready: function () {

                    }
                });
            }

            this.cropper_preview.replace(imgUrl, false);
            img.alt = type;

            this.preview_img_url = imgUrl;
            this.previewModal = true;
        },
        showCheckModal: function (imgFile) {
            var img = document.getElementById('image_check');
            var imgUrl = imgFile.src;

            this.check_preview_info = imgFile.number + ' : ' + imgFile.type;

            if (!this.cropper_check) {
                this.cropper_check = new Cropper(img, {
                    aspectRatio: NaN,
                    ready: function () {

                    }
                });
            }

            this.cropper_check.replace(imgUrl, false);

            this.check_img_url = imgUrl;
            this.checkModal = true;
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

            // let size = Math.floor(this.file.size / 1024);
            // if (size > 2048) {
            //     // 这里可以加个文件大小控制
            //     return false
            // }

            // // 触发这个组件对象的input事件
            // this.$emit('input', this.file);
            //
            // // 这里就可以获取到文件的名字了
            // this.fileName = this.file.name;
            //
            // // 这里加个回调也是可以的
            // this.onChange && this.onChange(this.file, inputDOM.value);

            this.imgPreview(file, 'main');

        },
        handleMultipleFileChange(e) {
            let inputDOM = this.$refs.inputer_attachment;
            // 通过DOM取文件数据
            var file = inputDOM.files[0];
            for (var i = 0; i < inputDOM.files.length; ++i) {
                this.src_img_files.push(inputDOM.files[i]);
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

        },
        /*图片预览*/
        imgPreview(file, type) {
            let self = this;
            // 看支持不支持FileReader
            if (!file || !window.FileReader) return;

            if (/^image/.test(file.type)) {
                // 创建一个reader
                var reader = new FileReader();
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
            })
            ;
        },
        deleteImgFromDB: function (file) {
            this.$Modal.confirm({
                title: '是否删除',
                content: '确认删除该图片',
                onOk: () => {
                    let index = this.dest_img_files.indexOf(file);
                    var deleteFile = this.dest_img_files.splice(index, 1);
                    let len = this.dest_img_files.length;
                    var number = new Number(deleteFile[0].number);

                    if (number != 0) {
                        var i = this.dest_img_files[0].number == '0000' ? number : number - 1;

                        for (; i < len; ++i) {
                            this.dest_img_files[i].number = this.formatNumberToString(number);
                            ++number;
                        }
                    }

                    if (this.file_number >= 1) {
                        --this.file_number;
                    }
                    this.$Message.info('删除成功');
                },
                onCancel: () =>
            {
                }
            })
            ;
        },
        /*预览框处理*/
        confirmUpload: function () {
            var img = document.getElementById('image_preivew');
            var imgUrl = this.preview_img_url;
            var number = '';

            if (!this.showAttachSelect) {
                number = '0000';
                this.file_type = '申请书';
                if (this.dest_img_files.length >= 1 && this.dest_img_files[0].number == '0000') {
                    this.dest_img_files.splice(0, 1);
                }
            } else {
                number = this.formatNumberToString(this.file_number);
            }

            var config = {
                src: imgUrl,
                type: this.file_type,
                number: number,
                date: Date().toString()
            };

            if (this.showAttachSelect && this.file_type == '') {
                this.$Notice.warning({
                    title: '未选择图片类型',
                    desc: '未选择图片类别!请重新保存!'
                });
            } else if (this.showAttachSelect) {
                this.dest_img_files.push(config);
                ++this.file_number;
            } else if (!this.showAttachSelect) {
                this.dest_img_files.unshift(config);
            }

            this.file_type = '';
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
        },
        /*新建任务弹出框*/
        newTask:function(){
            this.newTaskModal = true;
        },
        confirmNewTask:function(){
            if (this.validateNewTask()){
                this.createNewTask();
                // alert(JSON.stringify({
                //     stransactionnum:this.workIndex.sTransactionNum,
                //     sdepositorname:this.workIndex.sDepositorName,
                //     sbusinesscategory:this.workIndex.sBusinessCategory,
                //     saccounttype:this.workIndex.sAccountType,
                //     sbankcode:this.workIndex.sBankCode,
                //     sbankname:this.workIndex.sBankName,
                //     supusercode:this.workIndex.sUpUserCode,
                //     supusername:this.workIndex.sUpUserName
                // }));
            }
        },
        cancelNewTask:function(){
            this.newTaskModal = false;
        },
        validateNewTask:function () {
            if (this.workIndex.sBusinessCategory == '' || this.workIndex.sBusinessCategory == null||
                this.workIndex.sAccountType == '' || this.workIndex.sAccountType == null ||
                this.workIndex.sDepositorName == '' || this.workIndex.sDepositorName == null) {
                this.$Message.warning('请输入完整信息');
                return false;
            }
            
            return true;
        },
        createNewTask:function () {
            this.$http.post('/workIndex',{
                sdepositorname:this.workIndex.sDepositorName,
                sbusinesscategory:this.workIndex.sBusinessCategory,
                saccounttype:this.workIndex.sAccountType,
                sbankcode:this.workIndex.sBankCode,
                sbankname:this.workIndex.sBankName,
                supusercode:this.workIndex.sUpUserCode,
                supusername:this.workIndex.sUpUserName
            },{
                headers: {'Content-Type':'application/json'}
            }).then((response)=>{
                if(response.status == '200'){
                    this.newTaskModal = false;
                    this.ifEdit = true;
                    this.workIndex.sTransactionNum = response.data.stransactionnum;
                } else{
                    console.log(response.body);
                }
            }).catch((error)=>{
                console.log(error);
            });
        },
        /*初始化编辑界面*/
        initTransactionInfo: function () {
            this.$http.get('/businessCategory', {
                headers: {'Content-Type':'application/json'}
            }).then((response)=>{
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
                console.log(error);
            });

            this.$http.get('/accountType',{
                headers: {'Content-Type':'application/json'}
            }).then((response)=>{
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
                console.log(error);
            });
        }
    },
    mounted:function () {
        this.$nextTick(() => {
            this.initTransactionInfo();
        });

        var image_main = document.getElementById('image_main');
        var image_attachment = document.getElementById('image_attachment');

        this.cropper_main = new Cropper(image_main, {
            aspectRatio: 210 / 297,
            ready: function () {

            }
        });

        this.cropper_attachment = new Cropper(image_attachment, {
            aspectRatio: 210 / 297,
            ready: function () {

            }
        });
    }
};