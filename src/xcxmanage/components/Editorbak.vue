<template>
    <div ref="editor"></div>
</template>

<script>
    import E from 'wangeditor'
    export default {
        name: 'editor',
        props:{
            value:{
                default:'',
                type:String
            }
        },
        data () {
            return {
                editor: ''
            }
        },
        methods: {
            getContent: function () {
                alert(this.editorContent)
            }
        },
        mounted() {
            this.editor = new E(this.$refs.editor)
            
            this.editor.customConfig.uploadImgServer = this.$store.state.base.uploadUrl;
            this.editor.customConfig.uploadFileName = 'image';
            this.editor.customConfig.uploadImgHooks={
                customInsert(insertImg, result, editor){
                    var url = result.data;
                    insertImg(result.data)
                }
            }
            this.editor.customConfig.onchange = (html) => {
                this.$emit('input',html)
            }
            this.editor.create()
        },
        watch:{
            value(newval){
                this.value = newval;
                this.editor.txt.html(newval);
            }
        }
    }
</script>

<style scoped>
</style>