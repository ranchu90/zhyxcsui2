import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import {updateAccountSys,getImportRecord} from '../../api/newApi/sv_account_sys';
import Cookies from 'js-cookie';
import {getSystemLog} from "../../api/system_log";

Cropper.setDefaults({
    viewMode: 1,
    dragMode: 'move',
    autoCrop: false,
    toggleDragModeOnDblclick: false
});

export default {
    data () {

        return {
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
            orgaList:[], //机构列表
            file: null,
            loadingStatus: false,
            totalPages:1,
            currentPage:1,
            pageSize:10,
            table_loading:false,
            table_default_cols: [
                {
                    type:'index',
                    align:'center',
                    width:60
                },
                {
                    title: '更新成功数目',
                    key: 'updatenum'
                },
                {
                    title: '更新失败数目',
                    key: 'failnum'
                },
                {
                    title:'上传ip地址',
                    key: 'uploadipaddress'
                },
                {
                    title: '上传用户代码',
                    key: 'uploadusercode'
                },
                {
                    title: '上传用户姓名',
                    key: 'uploadusername'
                },
                {
                    title: '上传时间',
                    key: 'uploadtime'
                }
            ],
            table_list: [
                {
                    updatenum:'123',
                    failnum:'ues',
                    uploadipaddress:'启用',
                    uploadusercode:'6',
                    uploadusername:'2018-06-18',
                    uploadtime:'1332019203'
                }]
        };
    },
    methods: {
        handleUpload:function(file) {
            this.file = file;
            return false;
        },
        upload:function (){
            this.loadingStatus = true;

            var formData = new FormData();
            formData.append("file", this.file);

            updateAccountSys(formData).then(response => {
                if (response.status == 200){
                    const data = response.data;

                    let content = {
                        top:50,
                        duration:10,
                        title: data.message,
                        desc: data.hasOwnProperty("extra")? data.extra : ""
                    };

                    this.file = null;
                    this.loadingStatus = false;
                    switch (data.result) {
                        case 'error':this.$Notice.error(content);
                            break;
                        case 'success':this.$Notice.success(content);
                            break;
                        case 'mistake':this.$Notice.warning(content);
                            break;
                    }

                    this.currentPage = 1;
                    this.getImportRecord();
                }
            });
        },
        changePage:function (pageNum) {
            this.table_loading = true;

            if (pageNum != null){
                this.currentPage = pageNum;
            }

            this.getImportRecord();
        },
        changePageSize:function (pageSize) {
            this.table_loading = true;

            if (pageSize != null){
                this.pageSize = pageSize;
            }

            this.getImportRecord();
        },
        getImportRecord:function () {
            getImportRecord(this.currentPage, this.pageSize).then(response => {
                if (response.status === 200){
                    const pageInfo = response.data.pageInfo;
                    this.table_list = pageInfo.list;
                    this.totalPages = pageInfo.total;
                    this.table_loading = false;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        }
    },
    mounted:function () {
        this.current_user = JSON.parse(Cookies.get('user'));
        this.user = this.user_default;

        this.getImportRecord();

    }
};
