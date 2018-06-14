<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        height: 100%;
    }
    .layout-assistant{
        width: 400px;
        margin: 0 auto;
        height: inherit;
        font-size: small;
    }
    .layout-content{
        height: 100%;
        width: 100%;
        margin: 0px;
        overflcow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 5px;
    }
    .img-container{
        margin-bottom: 1rem;
        height: 0;/*594*420*/
        /*min-height: 600px;*/
        /*max-height: 700px;*/
        width: 100%;
        padding-bottom: 142.43%;
        /*min-width: 210px;*/
        /*margin-top: 5px;*/
        border: 1px solid #dddee1;
    }
    .main-file{
        float: left;
        position: relative;
        width: 100%;
    }
    .attachment-files{
        /*padding-left: 10px;*/
        float: left;
        position: relative;
        width: 100%;
    }
    .attachment-imgs{
        width: 100%;
        margin-left: 5px;
        text-align: center;
        float: left;
        position: relative;
    }
    .informations{
        width: 100%;
        margin-left: 10px;
        margin-left: 10px;
        float: left;
        position: relative;
        text-align: center;
    }
    .img-list{
        display: inline-block;
        text-align: center;
        overflow: auto;
        /*position: absolute;*/
        bottom: 0px;
    }
    .img-list li{
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
        top: 0;left: 0;right: 0;bottom: 0;
        z-index: 10; /* 这个z-index之后说到*/
    }
    .myCropper-workspace {
        width: 100%;
        height: 0px;
        margin-top: 5px;
    }
    .myCropper-workspace .myCropper-words{
        text-align: center;
        font-size: 18px;
        padding-top: 180px;
    }
    .tool-bar{
        text-align: center;
    }
    .tool-bar Button{
        margin-right: 3px;
        /*margin-bottom: 5px;*/
        margin-top: 2px;
        text-align: center;
        width: inherit;
    }
    .cropper-container{
        height: 100%;
        width: 100%;
    }
    .cropper-preiveiw-container{
        text-align: left;
        display: inline-block;
    }
    .cropper-preiveiw-container .img-container{
        margin-bottom: 1rem;
        max-height: 708px;
        min-height: 297px;
        max-width: 520px;
        min-width: 210px;
        margin-top: 5px;
        display: block;
    }
    .layout-breadcrumb{
        padding: 0px 15px 0;
    }
    .form-input{
        width: 300px;
    }
</style>
<template>
    <div class="layout">
        <!--<Menu mode="horizontal" style="width: 100%; " theme="light" active-name="passed" @on-select="changeTab">-->
            <!--<div class="layout-assistant">-->
                <!--<MenuItem name="passed">-->
                    <!--<Badge :count="passed_Num" >-->
                    <!--<Icon type="ios-list"></Icon>-->
                    <!--待传证<span v-show="passed_Num!==0">&nbsp;&nbsp;&nbsp;</span>-->
                    <!--</Badge>-->
                <!--</MenuItem>-->
                <!--<MenuItem name="recheck">-->
                    <!--<Icon type="android-checkbox-outline-blank"></Icon>-->
                    <!--待复审-->
                <!--</MenuItem>-->
                <!--<MenuItem name="final">-->
                    <!--<Icon type="ios-flower"></Icon>-->
                    <!--已结束-->
                <!--</MenuItem>-->
            <!--</div>-->
        <!--</Menu>-->
        <div class="layout-breadcrumb">
            <Breadcrumb>
                <BreadcrumbItem to="/">
                    <Icon type="ios-home-outline"></Icon> 主页
                </BreadcrumbItem>
                <BreadcrumbItem to="/query">
                    <Icon type="social-buffer-outline"></Icon> 查询统计
                </BreadcrumbItem>
                <BreadcrumbItem to="/query">
                    <Icon type="pound"></Icon> {{breadCrumb}}
                </BreadcrumbItem>
                <BreadcrumbItem v-show="ifEdit">
                    <Button @click="returnSearch" type="primary" shape="circle" class="index" size="small">返回</Button>
                </BreadcrumbItem>
            </Breadcrumb>
        </div>
        <div class="layout-content">
            <div class="layout-content-main">
                <template>
                    <div v-show="!ifEdit">
                        <Form :model="formSearch" label-position="right" :label-width="150" inline>
                            <FormItem label="机构所在地区" v-show="userLevel === '7'">
                                <Select v-model="formSearch.currentBankArea" size="small" style="width: 250px" @on-change="getBankCity">
                                    <Option v-for="(item, index) in bankAreaList" :value="item.sbankareacode" :key="index">
                                        {{item.sareaname}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="机构所在城市" v-show="userLevel === '7' || userLevel === '4' || userLevel === '5' || userLevel === '2'">
                                <Select v-model="formSearch.currentCity" size="small" style="width: 250px">
                                    <Option v-for="(item, index) in bankCityList" :value="item.sbankcitycode" :key="index">
                                        {{item.scityname}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="类别代码" v-show="userLevel === '7' || userLevel === '4' || userLevel === '5'">
                                <Select v-model="formSearch.bankKind" size="small" style="width: 250px">
                                    <Option v-for="(item, index) in bankKindList" :value="item.sbankkind" :key="index">
                                        {{item.skindname}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="行别代码" v-show="userLevel === '7' || userLevel === '4' || userLevel === '5'">
                                <Select v-model="formSearch.bankType" size="small" style="width: 250px">
                                    <Option v-for="(item, index) in allBankTypeList" :value="item.sbanktypecode" :key="index">
                                        {{item.stypename}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="业务类别">
                                <Select v-model="formSearch.businessCategory" size="small" style="width: 250px" @on-change="getAccountType">
                                    <Option v-for="(item, index) in businessCategoryList" :value="item" :key="index">
                                        {{item}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="账户种类">
                                <Select v-model="formSearch.accountType" size="small" style="width: 250px">
                                    <Option v-for="(item, index) in accountTypeList" :value="item" :key="index">
                                        {{item}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="金融机构代码" v-show="userLevel === '7' || userLevel === '4' || userLevel === '5'">
                                <Input v-model="formSearch.orgaCode" size="small" style="width: 250px"></Input>
                            </FormItem>
                            <FormItem label="银行录入员代码" v-show="userLevel === '7' || userLevel === '4' || userLevel === '5'">
                                <Input v-model="formSearch.bankEntryUserCode" size="small" style="width: 250px"></Input>
                            </FormItem>
                            <FormItem label="银行复核员代码" v-show="userLevel === '7' || userLevel === '4' || userLevel === '5'">
                                <Input v-model="formSearch.bankReviewUserCode" size="small" style="width: 250px"></Input>
                            </FormItem>
                            <FormItem label="人民银行审核员代码" v-show="userLevel === '7' || userLevel === '5'">
                                <Input v-model="formSearch.renEntryUserCode" size="small" style="width: 250px"></Input>
                            </FormItem>
                            <FormItem label="人民银行复审员代码" v-show="userLevel === '7'">
                                <Input v-model="formSearch.renRecheckUserCode" size="small" style="width: 250px"></Input>
                            </FormItem>
                            <FormItem label="业务流水号">
                                <Input v-model="formSearch.transactionNum" size="small" style="width: 250px"></Input>
                            </FormItem>
                            <FormItem label="开户许可证核准号">
                                <Input v-model="formSearch.approvalCode" size="small" style="width: 250px"></Input>
                            </FormItem>
                            <FormItem label="开户许可证编号">
                                <Input v-model="formSearch.identifier" size="small" style="width: 250px"></Input>
                            </FormItem>
                            <FormItem label="开始时间">
                                <DatePicker v-model="formSearch.startTime" size="small" type="date" placeholder="选择日期" style="width: 250px"></DatePicker>
                            </FormItem>
                            <FormItem label="结束时间">
                                <DatePicker v-model="formSearch.endTime"  size="small" type="date" placeholder="选择日期" style="width: 250px"></DatePicker>
                            </FormItem>
                            <FormItem label="操作">
                                <Button type="primary" shape="circle" size="small" style="margin-bottom: 5px" @click="searchByConditions">
                                    <Icon type="ios-search"></Icon>
                                    搜索
                                </Button>
                                <Button type="text" shape="circle" size="small" style="margin-bottom: 5px" @click="resetConditions">
                                    <Icon type="ios-reload"></Icon>
                                    重置
                                </Button>
                            </FormItem>
                        </Form>
                        <Table stripe :columns="table_default_cols" :data="table_list" :loading="table_loading"></Table>
                        <div style="margin:10px;overflow:hidden;">
                            <div style="float: right;">
                                <Page :total="totalPages" :current="currentPage"
                                      :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize"
                                      show-total show-sizer transfer></Page>
                            </div>
                        </div>
                    </div>
                </template>
                <template>
                    <div class="cropper-container" v-show="ifEdit">
                        <Row type="flex" jutisfy="center" :gutter="6">
                            <!--<Col span="1">-->
                                <!--<div style="width: 100%">-->
                                <!--</div>-->
                            <!--</Col>-->
                            <Col span="8">
                                <div class="main-file">
                                    <div style="display: flex">
                                        <Tag>主件区</Tag>
                                        <div class="tool-bar">
                                            <Button type="primary" @click="zoom(0.1, 'main')" class="index" size="small" :disabled="!main_img_url">放大</Button>
                                            <Button type="primary" @click="zoom(-0.1, 'main')" class="index" size="small" :disabled="!main_img_url">缩小</Button>
                                            <Button type="primary" @click="rotate('main')" class="index" size="small" :disabled="!main_img_url">旋转</Button>
                                        </div>
                                    </div>
                                    <div class="myCropper-workspace" v-show="!main_img_url">
                                        <div class="myCropper-words">（空）</div>
                                    </div>
                                    <div class="img-container">
                                        <img id="image_main" :src="main_img_url" />
                                    </div>
                                </div>
                            </Col>
                            <Col span="8">
                                <div class="attachment-files">
                                    <div style="display: flex">
                                        <Tag>附件区</Tag>
                                        <div class="tool-bar">
                                            <Button type="primary" @click="zoom(0.1, 'attachment')" class="index" size="small":disabled="!attachment_img_url">放大</Button>
                                            <Button type="primary" @click="zoom(-0.1, 'attachment')" class="index" size="small":disabled="!attachment_img_url">缩小</Button>
                                            <Button type="primary" @click="rotate('attachment')" class="index" size="small":disabled="!attachment_img_url">旋转</Button>
                                        </div>
                                    </div>
                                    <div class="myCropper-workspace" v-show="!attachment_img_url">
                                        <div class="myCropper-words">（空）</div>
                                    </div>
                                    <div class="img-container" ref="attachment">
                                        <img id="image_attachment" :src="attachment_img_url" />
                                    </div>
                                </div>
                            </Col>
                            <Col span="3">
                                <div class="attachment-imgs">
                                    <div>
                                        <Tag color="green" type="border">附件列表</Tag>
                                    </div>
                                    <ul v-if="dest_img_files.length" class="img-list" :style="'height:'+img_list_height+'px'" >
                                        <li v-for="(img, index) in dest_img_files" :key="index+img.date" style="display: flex">
                                            <my-dest-image :imgfile="img" :index="index" @prepareImage="prepareImage" @initCropperImage="initCropperImage"  @updateImgDestFiles="updateImgDestFiles"></my-dest-image>
                                            <!--<Tooltip :content="img.type" placement="bottom-end">-->
                                                <!--<Tag style="width: 50px; size: 2px" color = green>-->
                                                    <!--{{img.number}}-->
                                                <!--</Tag>-->
                                            <!--</Tooltip>-->
                                            <div style="text-align: left;height: 50px">
                                                <div>
                                                    <Tooltip :content="img.number" placement="bottom">
                                                        <Tag style="width: 50px; size: 2px" color = green>
                                                            {{img.number}}
                                                        </Tag>
                                                    </Tooltip>
                                                </div>
                                                <div>
                                                    <Tooltip :content="img.type" placement="bottom">
                                                        <Tag style="width: auto; size: 2px" type="border">
                                                            {{img.type}}
                                                        </Tag>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </Col>
                            <Col span="4">
                                <div class="informations">
                                    <div>
                                        <Tag color="blue" type="border">基本信息区</Tag>
                                    </div>
                                    <Form :label-width="100">
                                        <FormItem label="流水号">
                                            <p>
                                                {{workIndex.stransactionnum}}
                                            </p>
                                        </FormItem>
                                        <FormItem label="业务类别">
                                            <p>
                                                {{workIndex.sbusinesscategory}}
                                            </p>
                                        </FormItem>
                                        <FormItem label="账户种类">
                                            <p>
                                                {{workIndex.saccounttype}}
                                            </p>
                                        </FormItem>
                                        <FormItem label="开户行机构代码">
                                            <p>
                                                {{workIndex.sbankcode}}
                                            </p>
                                        </FormItem>
                                        <FormItem label="开户行机构名称">
                                            <p>
                                                {{workIndex.sbankname}}
                                            </p>
                                        </FormItem>
                                        <FormItem label="存款人名称">
                                            <p>
                                                {{workIndex.sdepositorname}}
                                            </p>
                                        </FormItem>
                                    </Form>
                                </div>
                            </Col>
                            <!--<Col span="1">-->
                                <!--<div style="width: 100%">-->
                                <!--</div>-->
                            <!--</Col>-->
                        </Row>
                    </div>
                </template>
            </div>
        </div>
        <!--<Modal-->
                <!--v-model="previewModal"-->
                <!--title="请检查图片内容和清晰度"-->
                <!--:styles="{display: 'flex', alignItems:'center', justifyContent:'center', top:'10px'}">-->
            <!--<div class="cropper-preiveiw-container">-->
                <!--<div class="img-container">-->
                    <!--<img id="image_preivew" class="cropper-hidden" />-->
                <!--</div>-->
            <!--</div>-->
            <!--<div slot="footer">-->
                <!--<Button type="default" @click="cancelUpoad">-->
                    <!--取消-->
                <!--</Button>-->
                <!--<Button type="primary" @click="confirmUpload">-->
                    <!--保存-->
                <!--</Button>-->
            <!--</div>-->
        <!--</Modal>-->
        <!--<Modal-->
                <!--id="checkModal"-->
                <!--:title="check_preview_info"-->
                <!--v-model="checkModal"-->
                <!--:styles="{display: 'flex', alignItems:'center', justifyContent:'center', top:'10px'}">-->
            <!--<div class="cropper-preiveiw-container">-->
                <!--<div class="img-container">-->
                    <!--<img id="image_check" class="cropper-hidden" :src="preview_img_url" />-->
                <!--</div>-->
            <!--</div>-->
        <!--</Modal>-->
        <!--<Modal-->
                <!--v-model="newTaskModal"-->
                <!--title="新建用户"-->
                <!--:styles="{display: 'flex', alignItems:'left', justifyContent:'center'}">-->
            <!--<div class="cropper-preiveiw-container">-->
                <!--<Form ref="newTaskForm" :model="user" :label-width="100">-->
                    <!--<FormItem label="用户代码" prop="sbusinesscategory">-->
                        <!--<Input v-model="user.susercode" type="text" :row="2" placeholder="请输入用户代码..."></Input>-->
                    <!--</FormItem>-->
                    <!--<FormItem label="用户级别" prop="saccounttype">-->
                        <!--<Select v-model="user.suserlevel" style="width:320px" @on-change="getOrgaCode" v-if="current_user.userlevel !== '7'">-->
                            <!--<Option value="4">本级人行录入员</Option>-->
                            <!--<Option value="5">本级人行复审员</Option>-->
                            <!--<Option value="6">下级人行主管</Option>-->
                            <!--<Option value="3">本级商业银行主管</Option>-->
                        <!--</Select>-->
                        <!--<p v-if="current_user.userlevel === '7'">-->
                            <!--地市人行主管-->
                        <!--</p>-->
                    <!--</FormItem>-->
                    <!--<FormItem label="行别"  v-if="user.suserlevel === '3'">-->
                        <!--<Select v-model="bankType" style="width:320px" @on-change="getOrgaCode" >-->
                            <!--<Option v-for="(item, index) in bankTypeList" :value="item.sbanktypecode" :key="index">-->
                                <!--{{ item.stypename}}-->
                            <!--</Option>-->
                        <!--</Select>-->
                    <!--</FormItem>-->
                    <!--<FormItem label="用户机构" >-->
                        <!--<Select v-model="user.sbankcode" v-if="user.suserlevel === '3' || user.suserlevel === '6' || current_user.userlevel === '7'" style="width:320px"  clearable filterable>-->
                            <!--<Option v-for="(item, index) in orgaList" :value="item.sbankcode" :label="item.sbankname" :key="index">-->
                                <!--{{ item.sbankname}}-->
                            <!--</Option>-->
                        <!--</Select>-->
                        <!--<p v-if="user.suserlevel === '4' || user.suserlevel === '5'">-->
                            <!--{{current_user.bankcode}}-->
                        <!--</p>-->
                    <!--</FormItem>-->
                    <!--<FormItem label="真实姓名">-->
                        <!--<Input v-model="user.susername" type="text" :row="10" placeholder="请输入真实姓名..."></Input>-->
                    <!--</FormItem>-->
                    <!--&lt;!&ndash;<FormItem label="用户状态">&ndash;&gt;-->
                        <!--&lt;!&ndash;&lt;!&ndash;<Input v-model="user.suserstate" type="textarea" :row="10" placeholder="请输入用户状态..."></Input>&ndash;&gt;&ndash;&gt;-->
                        <!--&lt;!&ndash;<div>&ndash;&gt;-->
                            <!--&lt;!&ndash;<RadioGroup v-model="user.suserstate" type="button">&ndash;&gt;-->
                                <!--&lt;!&ndash;<Radio label="0" >启用</Radio>&ndash;&gt;-->
                                <!--&lt;!&ndash;<Radio label="1">停用</Radio>&ndash;&gt;-->
                            <!--&lt;!&ndash;</RadioGroup>&ndash;&gt;-->
                        <!--&lt;!&ndash;</div>&ndash;&gt;-->
                    <!--&lt;!&ndash;</FormItem>&ndash;&gt;-->
                    <!--<FormItem label="电话">-->
                        <!--<Input v-model="user.stelephone" type="text" :row="10" placeholder="请输入电话..."></Input>-->
                    <!--</FormItem>-->
                    <!--<FormItem label="邮箱">-->
                        <!--<Input v-model="user.semail" type="text" :row="10" placeholder="请输入邮箱..."></Input>-->
                    <!--</FormItem>-->
                <!--</Form>-->
            <!--</div>-->
            <!--<div slot="footer">-->
                <!--<Button type="default" @click="cancelAddUser">-->
                    <!--取消-->
                <!--</Button>-->
                <!--<Button type="primary" @click="addUserConfirm">-->
                    <!--确定-->
                <!--</Button>-->
            <!--</div>-->
        <!--</Modal>-->
        <!--<Modal-->
                <!--v-model="saveTaskModal"-->
                <!--title="编辑用户"-->
                <!--:styles="{display: 'flex', alignItems:'center', justifyContent:'center'}">-->
            <!--<div class="cropper-preiveiw-container">-->
                <!--<Form ref="saveTaskForm" :model="user" :label-width="100">-->
                    <!--<FormItem label="用户代码">-->
                        <!--<p>-->
                            <!--{{user.susercode}}-->
                        <!--</p>-->
                    <!--</FormItem>-->
                    <!--<FormItem label="用户级别">-->
                        <!--<p>-->
                            <!--{{levelType(user.suserlevel)}}-->
                        <!--</p>-->
                    <!--</FormItem>-->
                    <!--<FormItem label="用户机构" style="width:350px">-->
                        <!--<p>-->
                            <!--{{ user.sbankname}}-->
                        <!--</p>-->
                    <!--</FormItem>-->
                    <!--<FormItem label="真实姓名">-->
                        <!--<Input v-model="user.susername" type="text" :row="10" placeholder="请输入真实姓名..."></Input>-->
                    <!--</FormItem>-->
                    <!--<FormItem label="用户状态">-->
                        <!--&lt;!&ndash;<Input v-model="user.suserstate" type="textarea" :row="10" placeholder="请输入用户状态..."></Input>&ndash;&gt;-->
                        <!--<div>-->
                            <!--<RadioGroup v-model="user.suserstate" type="button">-->
                                <!--<Radio label="0" >启用</Radio>-->
                                <!--<Radio label="1">停用</Radio>-->
                            <!--</RadioGroup>-->
                        <!--</div>-->
                    <!--</FormItem>-->
                    <!--<FormItem label="电话">-->
                        <!--<Input v-model="user.stelephone" type="text" :row="10" placeholder="请输入电话..."></Input>-->
                    <!--</FormItem>-->
                    <!--<FormItem label="邮箱">-->
                        <!--<Input v-model="user.semail" type="text" :row="10" placeholder="请输入邮箱..."></Input>-->
                    <!--</FormItem>-->
                <!--</Form>-->
            <!--</div>-->
            <!--<div slot="footer">-->
                <!--<Button type="default" @click="cancelSaveUser">-->
                    <!--取消-->
                <!--</Button>-->
                <!--<Button type="primary" @click="saveUserConfirm">-->
                    <!--确定-->
                <!--</Button>-->
            <!--</div>-->
        <!--</Modal>-->
    </div>
</template>
<script src="../../viewjs/query.js"></script>
