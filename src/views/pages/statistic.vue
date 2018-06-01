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
        <div class="layout-content">
            <div class="layout-content-main">
                <template>
                    <div>
                        <Form :model="formStatistic" label-position="right" :label-width="150" inline>
                            <FormItem label="所属人民银行">
                                <Input v-model="formStatistic.pbcCode" size="small" style="width: 250px"></Input>
                            </FormItem>
                            <FormItem label="机构所在地区">
                                <Input v-model="formStatistic.areaCode" size="small" style="width: 250px"></Input>
                            </FormItem>
                            <FormItem label="机构所在城市">
                                <Input v-model="formStatistic.cityCode" size="small" style="width: 250px"></Input>
                            </FormItem>
                            <FormItem label="机构类别">
                                <Input v-model="formStatistic.bankKind" size="small" style="width: 250px"></Input>
                            </FormItem>
                            <FormItem label="机构行别">
                                <Input v-model="formStatistic.bankType" size="small" style="width: 250px"></Input>
                            </FormItem>
                            <FormItem label="机构名称">
                                <Input v-model="formStatistic.bankCode" size="small" style="width: 250px"></Input>
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
                                <Button type="primary" shape="circle" size="small" style="margin-bottom: 5px" @click="measureWithConditions">
                                    <Icon type="ios-grid-view"></Icon>
                                    账户业务统计
                                </Button>
                                <Button type="primary" shape="circle" size="small" style="margin-bottom: 5px">
                                    <Icon type="ios-grid-view"></Icon>
                                    账户差错统计
                                </Button>
                                <Button type="text" shape="circle" size="small" style="margin-bottom: 5px" @click="resetConditions">
                                    <Icon type="ios-reload"></Icon>
                                    重置
                                </Button>
                            </FormItem>
                        </Form>
                        <Table stripe :columns="measure_table_cols" :data="measure_table_list" :loading="measure_table_loading" :v-show="measureTableShow"></Table>
                        <Table stripe :columns="mistake_table_cols" :data="mistake_table_list" :loading="mistake_table_loading" :v-show="mistakeTableShow"></Table>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script src="../../viewjs/statistic.js"></script>
