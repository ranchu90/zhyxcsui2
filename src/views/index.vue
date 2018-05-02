<style scoped lang="less">
    .index{
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        text-align: center;
        h1{
            height: 150px;
            img{
                height: 100%;
            }
        }
        h2{
            color: #666;
            margin-bottom: 200px;
            p{
                margin: 0 0 50px;
            }
        }
        .ivu-row-flex{
            height: 100%;
        }
    }
</style>
<template>
    <div id="app">
    <Button type="ghost" @click="goBank" class="index">Start iView</Button>
    <router-link to="/bank_entry">{{bank_entry}}</router-link>
    <Table stripe :columns="columns1" :data="data1"></Table>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                columns1: [
                    {
                        title: 'id',
                        key: 'id'
                    },
                    {
                        title: 'name',
                        key: 'name'
                    },
                    {
                        title: 'password',
                        key: 'password'
                    },
                    {
                        title: 'phone',
                        key: 'phone'
                    }
                ],
                data1: [],
                bank_entry:'跳转到银行录入员'
            }
        },
        methods:{
            GetNewData: function () {
                this.$http.get('/user/getAll').then(response => {
                    console.log(response.data);
                    // get body data
                    this.data1 = response.data;
                }, response => {
                    console.log(response.body);
                });
            },
            goBank:function () {
                this.$router.push({path:'/bank_entry'});
            }
        },
        mounted:function () {
            this.$nextTick(() => {
                this.GetNewData();
            });
        },
        created:function () {
        }
    }
</script>

