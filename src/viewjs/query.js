import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import {getAllBusinessBankType,} from '../api/banktype';
import {queryOperators, workIndexes} from '../api/workindex';
import {businessCategory, accountType} from '../api/image_standard';
import {getBankArea} from '../api/bank_area';
import {getBankCity} from '../api/bank_city';
import {getBankKind} from '../api/bank_kind';
import Cookies from 'js-cookie';
import {getBase64Image, getImages} from '../api/image';
import {orgaWithKindAndPbcCode} from "../api/orga";

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
                    key: 'sapprovalstate',
                    render:(h, params) => {
                        const state = params.row.sapprovalstate;
                        var text = '';

                        switch (state){
                            case '0':text = '待编辑';
                                break;
                            case '1':text = '待复核';
                                break;
                            case '2':text = '待审核';
                                break;
                            case '3':text = '已审核';
                                break;
                            case '4':text = '待复审';
                                break;
                            case '5':text = '业务终止';
                                break;
                        }

                        return h('p', text);
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
                    title:'提交人行时间',
                    key: 'scommittimes'
                },
                {
                    title:'审核完成时间',
                    key: 'scompletetimes'
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
                                        this.workIndex = params.row;
                                        this.ifEdit = true;
                                        this.getSavedImages();
                                        //动态设置图片列表的高度
                                        this.$nextTick(()=>{
                                            if (this.$refs.attachment) {
                                                this.img_list_height = this.$refs.attachment.clientHeight;
                                            }
                                        });

                                        this.breadCrumb = '业务详情';

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
                }
            ],
            table_list: [],
            user:{},
            user_default:{
                susercode:'',
                sbankcode:'',
                susername:'',
                suserstate:'0',
                suserlevel:'',
                stelephone:'',
                semail:''
            },
            current_user:{},
            orgaList:[],//机构列表
            table_loading: false,
            /*分页*/
            pageSize: 10,
            currentPage: 1,
            totalPages: 100,
            //选中的tab标签，编辑，复核，审核，通过
            passed_Num: 0,
            newTaskModal: false,
            saveTaskModal: false,
            bankType:'',
            allBankType:'',
            bankTypeList:[],
            allBankTypeList:[],
            formSearch:{
                currentBankArea: null,
                currentCity: null,
                bankKind: null,
                bankType:null,
                orgaCode:null,
                businessCategory: null,
                accountType: null,
                bankEntryUserCode: null,
                bankReviewUserCode: null,
                renEntryUserCode: null,
                renRecheckUserCode: null,
                transactionNum: null,
                approvalCode: null,
                identifier: null,
                startTime: null,
                endTime: null
            },
            formSearchDefault:{
                currentBankArea: null,
                currentCity: null,
                bankKind: null,
                bankType:null,
                orgaCode:null,
                businessCategory: null,
                accountType: null,
                bankEntryUserCode: null,
                bankReviewUserCode: null,
                renEntryUserCode: null,
                renRecheckUserCode: null,
                transactionNum: null,
                approvalCode: null,
                identifier: null,
                startTime: null,
                endTime: null
            },
            businessCategoryList:[],
            accountTypeList:[],
            bankAreaList:[],
            bankCityList:[],
            bankKindList:[],
            ifEdit:false,
            main_img_url:'',
            attachment_img_url:'',
            dest_img_files:[],
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
            file_number:1,
            breadCrumb:'查询条件',
            userLevel:'',
            ifXian:false,
            operators:[]
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
                this.dest_img_files = [];
                this.resetCropper();
                this.main_img_url = '';
                this.attachment_img_url = '';
                // this.review = '';
                this.file_number = 1;
                // this.accelerated = false; //是否申请加急状态
                // this.getBages();
            }
        }
    },
    methods: {
        changePage:function (pageNum) {
            this.table_loading = true;

            if (pageNum != null){
                this.currentPage = pageNum;
            }

            this.getWorkIndexes();
        },
        changePageSize:function (pageSize) {
            this.table_loading = true;

            if (pageSize != null){
                this.pageSize = pageSize;
            }

            workIndexes(this.currentPage, this.pageSize,
                this.formSearch.currentBankArea, this.formSearch.currentCity,
                this.formSearch.bankKind, this.formSearch.bankType,
                this.formSearch.businessCategory, this.formSearch.accountType,
                this.formSearch.orgaCode, this.formSearch.bankEntryUserCode,
                this.formSearch.bankReviewUserCode, this.formSearch.renEntryUserCode,
                this.formSearch.renRecheckUserCode, this.formSearch.transactionNum,
                this.formSearch.approvalCode, this.formSearch.identifier,
                this.formSearch.startTime, this.formSearch.endTime
            ).then(response => {
                if (response.status === 200){
                    const pageInfo = response.data.pageInfo;
                    this.table_list = pageInfo.list;
                    this.totalPages = pageInfo.total;
                    this.table_loading = false;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        initTable:function () {
            getAllBusinessBankType().then(response => {
                if (response.status === 200) {
                    this.allBankTypeList = response.data;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });

            businessCategory().then(response => {
                if (response.status === 200) {
                    this.businessCategoryList = response.data;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });

            if (this.userLevel === '7'){
                getBankArea().then(response => {
                    if (response.status === 200) {
                        this.bankAreaList = response.data;
                    }
                }).catch(error => {
                    this.$Message.error(error.message);
                });
            } else {
                var user = JSON.parse(Cookies.get('user'));

                this.formSearch.currentBankArea = user.bankAreaCode;
                this.getBankCity();
            }

            orgaWithKindAndPbcCode(this.current_user.bankcode, '0').then(response => {
                if (response.status === 200) {
                    this.ifXian = response.data.length > 0? false : true;

                    if (this.ifXian) {
                        this.formSearch.currentCity = this.current_user.bankCityCode;
                    }

                    this.changePage(1);
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });

            getBankKind().then(response => {
                if (response.status === 200) {
                    this.bankKindList = response.data;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });


        },
        levelType:function (level) {

            var text = '';
            switch (level) {
                case '1':
                    text = '银行录入员';
                    break;
                case '2':
                    text = '银行复核员';
                    break;
                case '3':
                    text = '银行主管';
                    break;
                case '4':
                    text = '人行录入员';
                    break;
                case '5':
                    text = '人行复审员';
                    break;
                case '6':
                    text = '人行主管';
                    break;
                case '7':
                    text = '人行超级管理员';
                    break;
            }

            return text;
        },
        getWorkIndexes:function(){
            workIndexes(this.currentPage, this.pageSize,
                this.formSearch.currentBankArea, this.formSearch.currentCity,
                this.formSearch.bankKind, this.formSearch.bankType,
                this.formSearch.businessCategory, this.formSearch.accountType,
                this.formSearch.orgaCode, this.formSearch.bankEntryUserCode,
                this.formSearch.bankReviewUserCode, this.formSearch.renEntryUserCode,
                this.formSearch.renRecheckUserCode, this.formSearch.transactionNum,
                this.formSearch.approvalCode, this.formSearch.identifier,
                this.formSearch.startTime, this.formSearch.endTime
                ).then(response => {
                    if (response.status === 200){
                        const pageInfo = response.data.pageInfo;
                        this.table_list = pageInfo.list;
                        this.totalPages = pageInfo.total;
                        this.table_loading = false;
                    }
                }).catch(error => {
                    this.$Message.error(error.message);
                });
        },
        getAccountType:function (value) {
            this.accountTypeList = [];
            this.formSearch.accountType = null;

            if (this.formSearch.businessCategory != null){
                accountType(this.formSearch.businessCategory).then(response => {
                    if (response.status === 200){
                        this.accountTypeList = response.data;
                    }
                }).catch(error => {
                    this.$Message.error(error.message);
                });
            }
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
        prepareImage: function (id) {
            var image = document.getElementById(id);
            this.imgPreview(image, 'attachment');
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
        getBankCity:function () {
            if (this.userLevel === '7'){
                this.bankCityList = [];
            }

            this.formSearch.currentCity = null;

            if (this.formSearch.currentBankArea != null){
                getBankCity(this.formSearch.currentBankArea).then(response => {
                    if (response.status === 200){
                        this.bankCityList = response.data;
                    }
                }).catch(error => {
                    this.$Message.error(error.message);
                });
            }
        },
        searchByConditions:function () {
            this.currentPage = 1;
            this.getWorkIndexes();
        },
        resetConditions:function () {
            for (var key in this.formSearch) {
                this.formSearch[key] = null;
            }

            this.formSearch.currentBankArea = this.current_user.bankAreaCode;
            if (this.ifXian) {
                this.formSearch.currentCity = this.current_user.bankCityCode;
            }
        },
        returnSearch:function () {
            this.ifEdit = false;
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
        updateImgDestFiles:function (data) {
            if (this.dest_img_files[data.index] != null) {
                this.dest_img_files[data.index].src = data.src;
                this.dest_img_files[data.index].ifBase64 = true;
            }
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
        }
    },
    mounted:function () {
        this.current_user = JSON.parse(Cookies.get('user'));
        this.user = this.user_default;
        this.userLevel = this.current_user.userlevel;

        this.initTable();
        this.initCropper();
    }
};
