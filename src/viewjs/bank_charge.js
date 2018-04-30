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
                            }, '查看')]);
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
            src_radio_model:true,
            showAttachSelect:true,
            formItem: {
                input: '',
                textarea: ''
            },
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
            user_info:{
                name:'录入员', 
                unit:'中国银行'
            },
            page_status:'待编辑',
            businessList: [
                {
                    value: '开户',
                    label: '开户'
                },
                {
                    value: '销户',
                    label: '销户'
                },
                {
                    value: '变更',
                    label: '变更'
                }],
            accountTypeList: [
                {
                    value: '非预算管理类单位基本存款户',
                    label: '非预算管理类单位基本存款户'
                },
                {
                    value: '预算管理类单位基本存款户',
                    label: '预算管理类单位基本存款户'
                },
                {
                    value: '临时机构临时户',
                    label: '临时机构临时户'
                },
                {
                    value: '非临时机构临时户',
                    label: '非临时机构临时户'
                }
            ]
        };
    },
    components: {
        'my-src-image': {
            props: ['imgfile', 'index'],
            data: function () {
                return {
                    id: 'src-img-' + this.index,
                    file: this.imgfile
                };
            },
            render: function (createElement) {
                var url = null;
                if (window.createObjectURL != undefined) { // basic
                    url = window.createObjectURL(this.file);
                } else if (window.URL != undefined) { // mozilla(firefox)
                    url = window.URL.createObjectURL(this.file);
                } else if (window.webkitURL != undefined) { // webkit or chrome
                    url = window.webkitURL.createObjectURL(this.file);
                }

                return createElement('div', {
                    style: {
                        position: 'relative'
                    }
                }, [
                    createElement('img', {
                        style: {
                            width: '50px',
                            height: '50px',
                            zIndex: '1'
                        },
                        attrs: {
                            id: this.id,
                            src: url
                        },
                        on: {
                            // "!contextmenu":this.deleteImg
                            '!click': this.prepareImage
                        }
                    })
                ]);
            },
            methods: {
                prepareImage: function (event) {
                    this.$emit('prepareImage', this.imgfile);
                }
            }
        }
    },
    methods:{
        /*查询*/
        GetNewData: function () {
            this.$http.get('/user/getAll').then(response => {
                console.log(response.data);
                // get body data
                this.data1 = response.data;
            }, response => {
                console.log(response.body);
            });
        },
        changeData:function(name){
            console.log(name);
            // switch (name){
            //     case '1':console.log('1');break;
            //     case '2':console.log('2');break;
            //     case '3':console.log('3');break;
            // } 
        },
        /*图片编辑，放大旋转，剪裁*/
        zoom:function (name, type) {
            switch (type){
                case 'main':this.cropper_main.zoom(name);break;
                case 'attachment':this.cropper_attachment.zoom(name);break;
            } 
        },
        rotate:function (type) {
            switch (type){
                case 'main':this.cropper_main.rotate(90);break;
                case 'attachment':this.cropper_attachment.rotate(90);break;
            }
        },
        showPreviewModal:function (type) {
            var img = document.getElementById('image_preivew');
            var imgUrl = '';
            
            if (type == 'main'){
                imgUrl = this.main_img_url;
                this.showAttachSelect = false;
            } else {
                imgUrl = this.attachment_img_url;
                this.showAttachSelect = true;
            }
            
            if (!this.cropper_preview){
                this.cropper_preview = new Cropper(img,{
                    aspectRatio: NaN,
                    ready:function () {

                    }
                });
            } 
            
            this.cropper_preview.replace(imgUrl, false);
            img.alt = type;
            
            this.preview_img_url = imgUrl;
            this.previewModal = true;
        },
        /*图片预览*/
        imgPreview (file, type) {
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
        updateCropper:function (url, type) {
            switch (type){
                case 'main':this.main_img_url = url;
                    this.cropper_main.replace(url, false);
                    this.cropped_main = false;
                    break;
                case 'attachment':this.attachment_img_url = url;
                    this.cropper_attachment.replace(url, false);
                    this.cropped_attachment = false;
                    break;
            }
        },
        transImage:function (file) {
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
        prepareImage:function (imgFile) {
            this.imgPreview(imgFile, 'attachment');
        }
    },
    mounted:function () {
        // this.$nextTick(() => {
        //     this.GetNewData();
        // });

        var image_main = document.getElementById('image_main');
        var image_attachment = document.getElementById('image_attachment');

        this.cropper_main = new Cropper(image_main, {
            aspectRatio: 210/297,
            ready:function () {

            }
        });

        this.cropper_attachment = new Cropper(image_attachment, {
            aspectRatio: NaN,
            ready:function () {
                
            }
        });

    },
    created:function () {

    }
};