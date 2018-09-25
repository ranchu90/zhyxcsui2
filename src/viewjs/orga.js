import Cookies from 'js-cookie';
import {getBankArea} from "../api/bank_area";
import {getBankCity} from '../api/bank_city';
import {getBankKind} from '../api/bank_kind';
import {getBankTypeByBankKind} from '../api/banktype';
import {
    getCurrentPage,
    removeOrgaList,
    getBankCityByBankCode,
    addOrga,
    getNextOrgaIsOnCountByBankCode,
    updateOrga
} from '../api/orga';
import {getPBCList} from "../api/statisticAjax";

export default {
    data() {
        const validateBankAreaCode = (rule, value, callback) => {
            if (value === undefined || value === null || value.trim().length === 0) {
                callback(new Error('机构所在地区不能为空'));
            } else {
                callback();
            }
        };
        const validateBankCityCode = (rule, value, callback) => {
            if (value === undefined || value === null || value.trim().length === 0) {
                callback(new Error('机构所在城市不能为空'));
            } else {
                callback();
            }
        };
        const validateBankKind = (rule, value, callback) => {
            if (value === undefined || value === null || value.trim().length === 0) {
                callback(new Error('机构类别不能为空'));
            } else {
                callback();
            }
        };
        const validateBankTypeCode = (rule, value, callback) => {
            if (value === undefined || value === null || value.trim().length === 0) {
                callback(new Error('机构行别不能为空'));
            } else {
                callback();
            }
        };
        const validateTopBankCode = (rule, value, callback) => {
            if (value === undefined || value === null || value.trim().length === 0||value==='999999999999') {
                callback();
            } else {
                if (this.orga.sbankkind === '0') {
                    callback(new Error('人民银行没有直属上级行的属性'));
                }
                if (!/^\d{12}$/.test(value)) {
                    callback(new Error('直属上级行行代码必须是12位数字'));
                } else {
                    if (this.orga.sbanktypecode !== value.substr(0, 3)) {
                        callback(new Error('直属上级行行代码与机构行别不匹配'));
                    } else {
                        getBankCityByBankCode(value).then(response => {
                            if (response.status === 200) {
                                const topBankOrga = response.data;
                                if (topBankOrga === undefined || topBankOrga === null || topBankOrga === '') {
                                    callback(new Error('直属上级行行代码指定的机构不存在'));
                                } else {
                                    callback();
                                }
                            }
                        }).catch(error => {
                            this.$Message.error(error.message);
                        });
                    }
                }
            }
        };
        const validateTopBankCodeWhenUpdate = (rule, value, callback) => {
            if (value === undefined || value === null || value.trim().length === 0||value==='999999999999') {
                callback();
            } else {
                if (this.orga.sbankcode.substr(0, 1) === '0') {
                    callback(new Error('人民银行没有直属上级行的属性'));
                }
                if (!/^\d{12}$/.test(value)) {
                    callback(new Error('直属上级行行代码必须是12位数字'));
                } else {
                    if (this.orga.sbankcode.substr(0, 3) !== value.substr(0, 3)) {
                        callback(new Error('直属上级行行代码与机构行别不匹配'));
                    } else {
                        getBankCityByBankCode(value).then(response => {
                            if (response.status === 200) {
                                const topBankOrga = response.data;
                                if (topBankOrga === undefined || topBankOrga === null || topBankOrga === '') {
                                    callback(new Error('直属上级行行代码指定的机构不存在'));
                                } else {
                                    callback();
                                }
                            }
                        }).catch(error => {
                            this.$Message.error(error.message);
                        });
                    }
                }
            }
        };
        const validatePbcode = (rule, value, callback) => {
            if (value === undefined || value === null || value.trim().length === 0) {
                callback(new Error('所属人民银行不能为空'));
            } else {
                callback();
            }
        };
        const validateBankCode = (rule, value, callback) => {
            if (!/^\d{12}$/.test(value)) {
                callback(new Error('机构代码必须是12位数字'));
            } else {
                if (this.orga.sbanktypecode !== value.substr(0, 3)) {
                    callback(new Error('机构代码与机构行别不匹配'));
                } else {
                    getBankCityByBankCode(value).then(response => {
                        if (response.status === 200) {
                            const currentBankOrga = response.data;
                            if (currentBankOrga === undefined || currentBankOrga === null || currentBankOrga === '') {
                                callback();
                            } else {
                                callback(new Error('机构代码已存在'));
                            }
                        }
                    }).catch(error => {
                        this.$Message.error(error.message);
                    });
                }
            }
        };
        const validateBankName = (rule, value, callback) => {
            if (value === undefined || value === null || value.trim().length === 0) {
                callback(new Error('机构名称不能为空'));
            } else if (value.length > 80) {
                callback(new Error('机构名称长度不能大于80个字符'));
            } else {
                callback();
            }
        };
        const validateBankState = (rule, value, callback) => {
            if (value === '1') {
                getNextOrgaIsOnCountByBankCode(this.orga.sbankcode).then(response => {
                    const countNum = response.data;
                    if (countNum === 0) {
                        callback();
                    } else {
                        callback(new Error('该机构存在启用状态的下级机构'));
                    }
                }).catch(error => {
                    this.$Message.error(error.message);
                });
            } else {
                callback();
            }
        };
        return {
            addOrgaRuleCustom: {
                sbankareacode: [
                    {validator: validateBankAreaCode, trigger: 'blur'}
                ],
                sbankcitycode: [
                    {validator: validateBankCityCode, trigger: 'blur'}
                ],
                sbankkind: [
                    {validator: validateBankKind, trigger: 'blur'}
                ],
                sbanktypecode: [
                    {validator: validateBankTypeCode, trigger: 'blur'}
                ],
                stopbankcode: [
                    {validator: validateTopBankCode, trigger: 'blur'}
                ],
                spbcode: [
                    {validator: validatePbcode, trigger: 'blur'}
                ],
                sbankcode: [
                    {validator: validateBankCode, trigger: 'blur'}
                ],
                sbankname: [
                    {validator: validateBankName, trigger: 'blur'}
                ]
            },
            updateOrgaRuleCustom: {
                spbcode: [
                    {validator: validatePbcode, trigger: 'blur'}
                ],
                stopbankcode: [
                    {validator: validateTopBankCodeWhenUpdate, trigger: 'blur'}
                ],
                sbankstate: [
                    {validator: validateBankState, trigger: 'blur'}
                ],
                sbankname: [
                    {validator: validateBankName, trigger: 'blur'}
                ]
            },
            AddOrgaModal: false,
            UpdateOrgaModal: false,
            orga: {
                sbankareacode: null,
                sbankcitycode: null,
                sbankkind: null,
                sbanktypecode: null,
                stopbankcode: null,
                spbcode: null,
                sbankcode: null,
                sbankname: null,
                sbankstate: null
            },
            pbcList: [],
            bankTypeList: [],
            bankKindList: [],
            bankCityList: [],
            bankAreaList: [],
            table_loading: false,
            table_list: [],
            pageSize: 10,
            pageNum: 1,
            totalPages: 1,
            formSearch: {
                bankAreaCode: null,
                bankCityCode: null,
                bankKind: null,
                bankTypeCode: null,
                topBankCode: null,
                pbcode: null,
                bankCode: null,
                bankName: null,
                bankState: null
            },
            table_default_cols: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '机构代码',
                    key: 'sbankcode'
                },
                {
                    title: '机构类别',
                    key: 'sbankkind'
                },
                {
                    title: '机构行别',
                    key: 'sbanktypecode'
                },
                {
                    title: '机构名称',
                    key: 'sbankname'
                },
                {
                    title: '直属上级行行代码',
                    key: 'stopbankcode'
                },
                {
                    title: '所属人民银行代码',
                    key: 'spbcode'
                },
                {
                    title: '机构所在地区代码',
                    key: 'sbankareacode'
                },
                {
                    title: '机构所在城市代码',
                    key: 'sbankcitycode'
                },
                {
                    title: '机构状态',
                    key: 'sbankstate',
                    render: (h, params) => {
                        const state = params.row.sbankstate;
                        const color = (state === '0') ? 'blue' : 'red';
                        const text = (state === '0') ? '启用' : '停用';

                        return h('Tag', {
                            props: {
                                type: 'dot',
                                color: color
                            }
                        }, text);
                    }
                }
            ]
        };
    },
    methods: {
        pageOrga: function (pageNum, pageSize) {
            getCurrentPage(pageNum, pageSize,
                this.formSearch.bankAreaCode,
                this.formSearch.bankCityCode,
                this.formSearch.bankKind,
                this.formSearch.bankTypeCode,
                this.formSearch.topBankCode,
                this.formSearch.pbcode,
                this.formSearch.bankCode,
                this.formSearch.bankName,
                this.formSearch.bankState).then(response => {
                if (response.status === 200) {
                    const pageInfo = response.data.pageInfo;
                    this.table_list = pageInfo.list;
                    this.totalPages = pageInfo.total;
                    this.table_loading = false;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        initData: function () {
            this.pageOrga(this.pageNum, this.pageSize);
            getBankArea().then(response => {
                if (response.status === 200) {
                    this.bankAreaList = response.data;
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

            getPBCList().then(response => {
                if (response.status === 200) {
                    this.pbcList = response.data;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        changePageNum: function (pageNum) {
            this.pageOrga(pageNum, this.pageSize);
        },
        changePageSize: function (pageSize) {
            this.pageSize = pageSize;
            this.pageOrga(this.pageNum, this.pageSize);
        },
        getBankCity: function (bankAreaValue) {
            if (bankAreaValue) {
                getBankCity(bankAreaValue).then(response => {
                    if (response.status === 200) {
                        this.bankCityList = response.data;
                    }
                }).catch(error => {
                    this.$Message.error(error.message);
                });
            } else {
                this.bankCityList = null;
            }
        },
        getBankTypes: function (bankKindValue) {
            if (bankKindValue) {
                getBankTypeByBankKind(bankKindValue).then(response => {
                    if (response.status === 200) {
                        this.bankTypeList = response.data;
                    }
                }).catch(error => {
                    this.$Message.error(error.message);
                });
            } else {
                this.bankTypeList = null;
            }
        },
        resetConditions: function () {
            for (var key in this.formSearch) {
                this.formSearch[key] = null;
            }
        },
        queryWithConditions: function () {
            this.pageNum = 1;
            this.pageSize = 10;
            this.pageOrga(this.pageNum, this.pageSize);
        },
        deleteSelections: function () {
            var orgaSelectedArray = this.$refs.orga_table_ref.getSelection();
            if (orgaSelectedArray === null || orgaSelectedArray.length === 0) {
                this.$Message.info('请勾选需要删除的记录');
                return;
            }
            this.$Modal.confirm({
                title: '删除机构确认',
                content: '<p>是否删除已选择的机构列表</p>',
                onOk: () => {
                    var bankCodeList = [];
                    orgaSelectedArray.forEach(function (item) {
                        bankCodeList.push(item.sbankcode.trim());
                    });
                    removeOrgaList(bankCodeList.toString()).then(response => {
                        if (response.status === 200) {
                            if (response.data.hasOwnProperty('warn')) {
                                this.$Message.warning(response.data.warn);
                            }
                            if (response.data.hasOwnProperty('success')) {
                                this.$Message.success(response.data.success);
                                this.pageOrga(this.pageNum, this.pageSize);
                            }
                        }
                    }).catch(error => {
                        this.$Message.error(error.message);
                    });
                }
            });
        },
        resetOrgaObj: function () {
            this.orga.sbankareacode = null;
            this.orga.sbankcitycode = null;
            this.orga.sbankkind = null;
            this.orga.sbanktypecode = null;
            this.orga.stopbankcode = null;
            this.orga.spbcode = null;
            this.orga.sbankcode = null;
            this.orga.sbankname = null;
            //this.orga.sbankstate = null;
        },
        OpenAddOrgaModal: function () {
            //this.bankCityList.splice(0,this.bankCityList.length);
            this.AddOrgaModal = true;
            this.UpdateOrgaModal = false;
        },
        addOrgaConfirm: function () {
            this.$refs.AddOrgaFormRef.validate((valid) => {
                if (valid) {
                    this.orga.sbankstate = '0';
                    addOrga(this.orga).then(response => {
                        const affectedRecords = response.data;
                        if (affectedRecords === 1) {
                            this.$Message.success('添加机构成功');
                            this.AddOrgaModal = false;
                            this.pageOrga(this.pageNum, this.pageSize);
                        }
                    }).catch(error => {
                        this.$Message.error(error.message);
                    });
                }
            });
        },
        cancelAddOrga: function () {
            this.AddOrgaModal = false;
        },
        OpenUpdateOrgaModal: function () {
            var orgaSelectedArray = this.$refs.orga_table_ref.getSelection();
            if (orgaSelectedArray === null || orgaSelectedArray.length === 0) {
                this.$Message.info('请勾选需要修改的记录');
                return;
            } else if (orgaSelectedArray.length > 1) {
                this.$Message.info('不能对多条记录同时修改,请选择1条记录');
                return;
            } else {
                this.UpdateOrgaModal = true;
                this.AddOrgaModal = false;
                this.orga.spbcode = orgaSelectedArray[0].spbcode;
                this.orga.sbankcode = orgaSelectedArray[0].sbankcode;
                this.orga.stopbankcode = orgaSelectedArray[0].stopbankcode;
                this.orga.sbankstate = orgaSelectedArray[0].sbankstate;
                this.orga.sbankname = orgaSelectedArray[0].sbankname;
            }
        },
        initCurrentOrga: function (isVisible) {
            if (!isVisible) {
                this.resetOrgaObj();
            }
        },
        updateOrgaConfirm: function () {
            this.$refs.UpdateOrgaFormRef.validate((valid) => {
                if (valid) {
                    updateOrga(this.orga).then(response => {
                        const affectedRecords = response.data;
                        if (affectedRecords === 1) {
                            this.$Message.success('修改机构成功');
                            this.UpdateOrgaModal = false;
                            this.pageOrga(this.pageNum, this.pageSize);
                        }
                    }).catch(error => {
                        this.$Message.error(error.message);
                    });
                }
            });
        },
        cancelUpdateOrga: function () {
            this.UpdateOrgaModal = false;
        }
    },
    mounted: function () {
        this.initData();
    }
};
