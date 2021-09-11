<template>
    <div ref="editor" style="height:300px;"></div>
</template>

<script>
import E from "wangeditor2.1.23";
export default {
    name: "editor",
    props: {
        value: {
            default: "",
            type: String
        }
    },
    data() {
        return {
            editor: "",
            isupdate: false,
            isupdates: false
        };
    },
    mounted() {
        var thiss = this;
        this.editor = new E(this.$refs.editor);
        this.editor.config.menus = [
            "source",
            "bold",
            "underline",
            "italic",
            "strikethrough",
            "eraser",
            "forecolor",
            "bgcolor",
            "quote",
            "fontfamily",
            "fontsize",
            "head",
            "unorderlist",
            "orderlist",
            "alignleft",
            "aligncenter",
            "alignright",
            "link",
            "unlink",
            "table",
            "img",
            "video",
            "insertcode",
            "undo",
            "redo",
            "fullscreen"
        ];
        this.editor.config.uploadImgUrl = this.$store.state.base.uploadUrl;
        this.editor.config.uploadImgFileName = "image";
        // 自定义load事件
        this.editor.config.uploadImgFns.onload = function(result, xhr) {
            result = JSON.parse(result);
            if (result.code == 200) {
                thiss.editor.command(null, "InsertImage", result.data);
            } else {
                this.$message.error(result.message);
            }
        };
        this.editor.onchange = html => {
            if (!this.isupdates) {
                this.isupdate = true;
            } else {
                this.isupdates = false;
            }
            this.$emit("input", this.editor.$txt.html());
        };
        this.editor.create();
        this.editor.$txt.html(this.value);
    },
    watch: {
        value(newval) {
            if (this.isupdate) {
                this.isupdate = false;
                return;
            }
            this.isupdates = true;
            this.value = newval;
            this.editor.$txt.html(newval);
            this.$nextTick(() => {
                this.isupdate = false;
            });
        }
    }
};
</script>
<style scoped>
#editor {
    height: 440px;
}
.wangEditor-container {
    border-radius: 2px;
    overflow: hidden;
    border: 1px solid #ccc;
}
</style>