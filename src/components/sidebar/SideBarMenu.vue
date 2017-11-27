<template>
    <li v-if="menu && isGranted(menu.permissionName)" :class="{ active: (isActive && !hasChild), 'menu-open': (isActive && hasChild), treeview: hasChild}">
        <a href="javascript:void(0);" @click="itemClick($event, menu)">
            <i v-if="menu.icon" :class="menu.icon">
                <span class="icon-bg" :class="colors[seq]"></span>
            </i>
            <span>{{L(menu.name)}}</span>
            <span v-if="menu.items && menu.items.length > 0" class="pull-right-container">
                <i class="fa fa-angle-left pull-right"></i>
            </span>
        </a>
        <ul v-if="menu.items && menu.items.length > 0" class="treeview-menu" :style="isActive ? 'display:block': ''">
            <SideBarMenu v-for="(item, index) in menu.items" :key="index" :menu="item"></SideBarMenu>
        </ul>
    </li>
</template>
<style lang="scss" rel="stylesheet/scss">
.sidebar-menu i.fa {
    font-size: 14px;
}
.sidebar-menu > li {
    border-bottom: 1px solid #1e2731;
}
.sidebar-menu > li > a {
    border-left: none !important;
    padding: 0;
    position: relative;
    display: block;
    height: 50px;
    line-height: 50px;
    text-decoration: none;
    // -moz-transition: all 0.3s ease-in-out;
    // -o-transition: all 0.3s ease-in-out;
    // -webkit-transition: all 0.3s ease-in-out;
    // transition: all 0.3s ease-in-out;
    > span {
        display: inline-block;
        height: 50px;
        line-height: 50px;
        padding-left: 10px;
        -webkit-transition: all 1.5s ease 0.3s, color 0.3s;
        transition: all 1.5s ease 0.3s, color 0.3s;
        transition-timing-function: cubic-bezier(0.28, 1.02, 0.36, 1.145);
    }
    > i {
        position: relative;
        display: block;
        float: left;
        width: 50px !important;
        height: 50px;
        line-height: 50px;
        border-right: 1px solid #1e2731;
        text-align: center;
        font-size: 1.4em;
        &:before {
            position: relative;
            z-index: 1;
        }
        > span.icon-bg {
            position: absolute;
            z-index: 12;
            z-index: 0;
            left: -47px;
            width: 100%;
            top: 0;
            bottom: 0px;
            -moz-transition: left 0.2s ease-in-out;
            -o-transition: left 0.2s ease-in-out;
            -webkit-transition: left 0.2s ease-in-out;
            transition: left 0.2s ease-in-out;
        }
    }
}
.sidebar-menu > li.active > a > i:before,
.sidebar-menu > li:hover > a > i:before {
    color: #fff;
}
.sidebar-menu > li.open > a > i .icon-bg,
.sidebar-menu > li.active > a > i .icon-bg,
.sidebar-menu > li:hover > a > i .icon-bg {
    left: 0;
}
.sidebar-mini:not(.sidebar-mini-expand-feature).sidebar-collapse .sidebar-menu {
    > li:hover {
        > .treeview-menu {
            top: 50px;
            margin-left: 0;
        }
        > a {
            > span {
                top: 0;
                margin-left: 0;
                padding: 0 5px 0 10px;
                background-color: inherit;
            }
            .pull-right-container {
                top: -43px !important;
                > i.fa {
                    line-height: 50px;
                }
            }
        }
    }
}
</style>
<script type="text/ecmascript-6">
import SideBarMenu from './SideBarMenu';
export default {
    name: 'SideBarMenu',
    props: {
        menu: Object,
        colorIndex: 0
    },
    data() {
        var list = [
            'bg-danger',
            'bg-orange',
            'bg-primary',
            'bg-success',
            'bg-pink',
            'bg-mint',
            'bg-purple',
            'bg-warning',
            'bg-success',
            'bg-info',
            'bg-primary-light',
            'bg-violet'
        ];
        return {
            seq: this.colorIndex > list.length - 1 ? 0 : this.colorIndex,
            colors: list,
            isActive: false,
            hasChild: this.menu.items && this.menu.items.length > 0
        };
    },
    watch: {
        '$store.state.sidebar.activedMenu'(val) {
            this.setIsActive(val);
        }
    },
    methods: {
        itemClick(e, menu) {
            var self = this;
            this.$router.push({ path: menu.path }, () => {
                self.$store.dispatch('SetActiveMenu', { menu });
            });
        },
        setIsActive(activedMenu) {
            this.isActive = false;
            if (activedMenu) {
                if (
                    activedMenu.path == this.menu.path &&
                    activedMenu.permissionName == this.menu.permissionName
                ) {
                    this.isActive = true;
                }
                this.menu.items.forEach(item => {
                    if (
                        item.path == activedMenu.path &&
                        item.permissionName == activedMenu.permissionName
                    ) {
                        this.isActive = true;
                    }
                });
            }
        }
    },
    mounted() {
        if (
            this.$store.state.sidebar &&
            this.$store.state.sidebar.activedMenu
        ) {
            this.setIsActive(this.$store.state.sidebar.activedMenu);
        }
    },
    components: {
        SideBarMenu
    }
};
</script>
