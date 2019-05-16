<style scoped>
    .layout {
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        height: 100%;
    }

    .layout-content {
        height: 100%;
        width: 100%;
        margin: 0px;
        overflcow: hidden;
        background: #fff;
        border-radius: 4px;
    }

    .layout-content-main {
        padding: 5px;
    }

    .img-list li {
        display: block;
        padding-top: 5px;
    }

    /*上传 */
    input {
        position: absolute;
        left: -9999px;
    }

    /* 使label充满整个box*/
    label {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10; /* 这个z-index之后说到*/
    }

    .myCropper-workspace .myCropper-words {
        text-align: center;
        font-size: 18px;
        padding-top: 180px;
    }

    .tool-bar Button {
        margin-right: 3px;
        margin-bottom: 5px;
        text-align: center;
        width: inherit;
    }

    .cropper-preiveiw-container .img-container {
        margin-bottom: 1rem;
        max-height: 708px;
        min-height: 297px;
        max-width: 520px;
        min-width: 210px;
        margin-top: 5px;
        display: block;
    }

</style>
<template>
    <div class="layout">
        <div class="layout-breadcrumb">
            <Breadcrumb>
                <BreadcrumbItem to="/">
                    <Icon type="ios-home-outline"></Icon>
                    主页
                </BreadcrumbItem>
                <BreadcrumbItem to="/statistic">
                    <Icon type="social-buffer-outline"></Icon>
                    查询统计
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Icon type="pound"></Icon>
                    业务统计
                </BreadcrumbItem>
            </Breadcrumb>
        </div>
        <div class="layout-content">
            <div class="layout-content-main">
                <template>
                    <div>
                        <Form :model="formStatistic" label-position="right" :label-width="150" inline>
                            <FormItem label="所属人民银行">
                                <Select v-model="formStatistic.pbcCode" size="small" style="width: 250px">
                                    <Option v-for="(item, index) in pbcList" :value="item.sbankcode" :key="index">
                                        {{item.sbankname}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="机构所在地区">
                                <Select v-model="formStatistic.areaCode" size="small" style="width: 250px"
                                        @on-change="getBankCity">
                                    <Option v-for="(item, index) in bankAreaList" :value="item.sbankareacode"
                                            :key="index">
                                        {{item.sareaname}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="机构所在城市">
                                <Select v-model="formStatistic.cityCode" size="small" style="width: 250px">
                                    <Option v-for="(item, index) in bankCityList" :value="item.sbankcitycode"
                                            :key="index">
                                        {{item.scityname}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="机构类别">
                                <Select v-model="formStatistic.bankKind" size="small" style="width: 250px"
                                        @on-change="getBankTypes">
                                    <Option v-for="(item, index) in bankKindList" :value="item.sbankkind" :key="index">
                                        {{item.skindname}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="机构行别">
                                <Select v-model="formStatistic.bankType" size="small" style="width: 250px">
                                    <Option v-for="(item, index) in bankTypeList" :value="item.sbanktypecode"
                                            :key="index">
                                        {{item.stypename}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="机构代码">
                                <Input v-model="formStatistic.bankCode" size="small" style="width: 250px"></Input>
                            </FormItem>
                            <FormItem label="机构名称">
                                <Input v-model="formStatistic.bankName" size="small" style="width: 250px"></Input>
                            </FormItem>
                            <FormItem label="开始时间">
                                <DatePicker v-model="formStatistic.startTime" size="small" type="date"
                                            placeholder="选择日期"
                                            style="width: 250px"></DatePicker>
                            </FormItem>
                            <FormItem label="结束时间">
                                <DatePicker v-model="formStatistic.endTime" size="small" type="date" placeholder="选择日期"
                                            style="width: 250px"></DatePicker>
                            </FormItem>
                            <FormItem label="操作" style="alignment: center">
                                <Button type="primary" shape="circle" size="small" style="margin-bottom: 5px"
                                        @click="measureWithConditions">
                                    <Icon type="ios-grid-view"></Icon>
                                    账户业务统计
                                </Button>
                                <Button type="primary" shape="circle" size="small" style="margin-bottom: 5px"
                                        @click="mistakeWithConditions">
                                    <Icon type="ios-grid-view"></Icon>
                                    账户差错统计
                                </Button>
                                <Tooltip content="请选择查询条件的开始时间作为账户资料清单的统计时间" placement="top-start">
                                    <Button type="primary" shape="circle" size="small" style="margin-bottom: 5px"
                                            @click="printAccountDiary">
                                        <Icon type="android-print"></Icon>
                                        账户资料清单打印
                                    </Button>
                                </Tooltip>
                                <Button type="text" shape="circle" size="small" style="margin-bottom: 5px"
                                        @click="resetConditions">
                                    <Icon type="ios-reload"></Icon>
                                    重置
                                </Button>
                            </FormItem>
                        </Form>
                        <div v-show="measureTableShow">
                            <span>
                                <Button type="primary" shape="circle" size="small" style="margin-bottom: 5px"
                                        @click="measurePrint">
                                    <Icon type="android-print"></Icon>
                                    账户业务量统计打印
                                </Button>
                            </span>
                            <Table stripe :columns="measure_table_cols" :data="measure_table_list"
                                   :loading="measure_table_loading" ref="measureTableRef"></Table>
                        </div>
                        <div v-show="mistakeTableShow">
                             <span>
                                <Button type="primary" shape="circle" size="small" style="margin-bottom: 5px"
                                        @click="mistakePrint">
                                    <Icon type="android-print"></Icon>
                                    账户差错统计打印
                                </Button>
                            </span>
                            <Table stripe :columns="mistake_table_cols" :data="mistake_table_list"
                                   :loading="mistake_table_loading"></Table>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script src="../../../viewjs/common/cm_statistic.js"></script>
