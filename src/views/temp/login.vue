<style rel="styleesheet" lang="scss">
@import '../../common/css/_mixin.scss';
@import '../../common/css/_extend.scss';
body {
    @include body-style(1.2em, #232323, #fefefe);
    font-family: Arial, Verdana, Helvetica, Sans-Serif;
    // background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px;
    // background-position: 0 0, 40px 60px, 130px 270px, 70px 100px;
    // background: url(../../assets/images/bg.jpg) no-repeat;
}

#app {
    margin-top: 0;
}
ul,
li {
    list-style: none;
}
.wrapper {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 1;
    z-index: 1;
    background: #4b79a1; /* fallback for old browsers */
    background: -webkit-linear-gradient(
        to left,
        #283e51,
        #4b79a1
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #283e51, #4b79a1);
    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
$height: 50px;
.login-wrapper {
    position: absolute;
    top: 20%;
    right: 0;
    left: 0;
    margin: auto;
    max-width: 400px; // background: rgba(3, 9, 19, 0.45);
    background: rgba(32, 40, 82, 0.78);
    // border-radius: 4px;
    box-shadow: 0 0 18px rgba(0, 0, 0, 0.2);
    .login-tabs {
        display: flex;
        padding: 0;
        margin: 0;
        li {
            flex: 1;
            &.current {
                > a {
                    background-color: transparent;
                    color: #fff;
                }
            }
            a {
                display: block;
                position: relative;
                text-align: center;
                background: rgba(16, 35, 56, 0.5);
                line-height: 50px;
                height: 50px;
                text-decoration: none;
                color: #fefefe;
                text-transform: uppercase;
                font-weight: 700;
                font-size: 16px;
                cursor: pointer;
                label {
                    margin: 0;
                    display: block;
                }
            }
        }
    }
    .tab-panel {
        position: relative;
        -webkit-perspective: 1000px;
        perspective: 1000px;
        -webkit-transform-style: preserve-3d;
        transform-style: preserve-3d;
        transition: all 0.4s linear;
        .tab-item {
            top: 0; // left: 0; // right: 0; // bottom: 0;
            position: absolute; // background: rgba(40, 57, 101, 0.9);
            transform: rotateY(180deg);
            backface-visibility: hidden;
            transition: all 0.4s linear;
            .title {
                text-align: center;
                font-size: 1.2em;
                height: $height;
                line-height: $height;
                color: #fff;
                // border-top: 1px solid rgb(30, 45, 66);
                // border-bottom: 1px solid rgb(30, 45, 66);
                margin-bottom: 0;
            }
            .form-wrapper {
                padding: 0;
                margin: 0;
                li {
                    padding: 10px 40px; // border-bottom: 1px solid rgb(30, 45, 66);
                    .form-group {
                        margin-bottom: 0;
                    }
                    .remember {
                        color: #fff;
                        margin-top: 10px;
                        input[type='checkbox'] {
                            background-color: #fff;
                        }
                    }
                    .btn-signin {
                        width: 100%;
                    }
                    .forgot {
                        text-align: center;
                        vertical-align: top;
                        font-size:1.4em;
                        padding-bottom:15px;
                        a {
                            text-decoration: none;
                            color: #fff;
                        }
                    }
                }
            }
            .third-part {
                padding: 0;
                margin: 0;
                li {
                    line-height: $height;
                    height: $height;
                    .icon-wrapper {
                        vertical-align: middle;
                        float: left;
                        width: 70px;
                        text-align: center;
                        font-size: 22px;
                    }
                    a {
                        display: block;
                        text-decoration: none;
                    }
                    .content {
                        text-align: center;
                        font-size: 1.4em;
                    }
                    .facebook {
                        background: rgb(59, 89, 152);
                        color: rgb(255, 255, 255);
                        .icon-wrapper {
                            background: rgb(40, 61, 104);
                        }
                    }
                    .googleplus {
                        background: rgb(221, 75, 57);
                        color: rgb(255, 255, 255);
                        .icon-wrapper {
                            background: rgb(181, 47, 31);
                        }
                    }
                }
            }
        }
    }
}
.tab-item-transform {
    transform: rotate(0) !important;
}
.login-header {
    position: relative;
    background-color: rgba(255, 255, 255, 0.02);
    text-align: center;
    .brand {
        display: inline-block;
        padding: 20px 0;
        color: rgba(14, 21, 58, 0.84);
        font-size: 40px;
        font-weight: bold;
    }
}
input[type='checkbox'],
input[type='radio'] {
    border: 1px solid #bbb;
    clear: none;
    cursor: pointer;
    display: inline-block;
    line-height: 0;
    height: 16px;
    margin: -4px 4px 0 0;
    outline: 0;
    padding: 0 !important;
    text-align: center;
    vertical-align: middle;
    width: 16px;
    min-width: 16px;
    -webkit-appearance: none;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    color: #555;
    -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
}
input[type='radio'] {
    border-radius: 50%;
}
input[type='checkbox']:checked:before,
input[type='radio']:checked:before {
    float: left;
    display: inline-block;
    vertical-align: middle;
    width: 16px;
    font-family: FontAwesome;
    font-size: 14px;
    font-weight: normal;
    speak: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    content: '\f00c';
    margin: 7px 0 0 -1px;
    color: #1e8cbe;
}
input[type='radio']:checked:before {
    content: '\f111';
}
</style>

<template>
    <div class="wrapper">
        <header class="login-header">
            <div class="brand">
                <i class="fa fa-th-large"></i> My Admin
            </div>
        </header>

        <div class="login-wrapper">
            <ul class="login-tabs">
                <li class="current">
                    <a name="tab" href="#" class="sign-in">
                        Login
                    </a>
                </li>
                <li>
                    <a name="tab" href="#" class="sign-up">
                        Sign Up
                    </a>
                </li>
            </ul>
            <div class="tab-panel">
                <div class="tab-item sign-in-tab tab-item-transform">
                    <p class="title">Enter your email and password to sign in</p>
                    <ul class="form-wrapper">
                        <li>
                            <div class="form-group">
                                <div class="input-group ">
                                    <div class="input-group-addon">
                                        <i class="fa fa-user"></i>
                                    </div>
                                    <input name="userName" type="text" class="form-control" placeholder="User Name" value="">
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-addon">
                                        <i class="fa fa-lock"></i>
                                    </div>
                                    <input name="tenancyName" type="password" class="form-control" placeholder="Password" value="">
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="row">
                                <div class="col-xs-8 text-left">
                                    <label class="form-control-static remember">
                                        <input type="checkbox"> Remember me
                                    </label>
                                </div>
                                <div class="col-xs-4">
                                    <div class="form-control-static text-right">
                                        <button id="btnLogin" class="btn btn-success text-uppercase btn-signin" type="submit">Log in</button>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li style="padding:0;">
                            <div class="forgot">
                                <a href="#">Forgot password?</a>
                            </div>
                        </li>
                    </ul>
                    <ul class="third-part">
                        <li>
                            <a href="#" class="facebook">
                                <div class="icon-wrapper">
                                    <i class="fa fa-facebook"></i>
                                </div>
                                <div class="content">
                                    <span>Sign in with
                                        <strong>Facebook</strong>
                                    </span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="#" class="googleplus">
                                <div class="icon-wrapper">
                                    <i class="fa fa-google-plus"></i>
                                </div>
                                <div class="content">
                                    <span>Sign in with
                                        <strong>Google+</strong>
                                    </span>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="tab-item sign-up-tab ">
                    <p class="title">Please sign up</p>
                    <ul class="form-wrapper">
                        <li>
                            <div class="form-group">
                                <div class="input-group ">
                                    <div class="input-group-addon">
                                        <i class="fa fa-hospital-o"></i>
                                    </div>
                                    <input name="tenancyName" type="text" class="form-control" placeholder="Tenancy name" value="">
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-addon">
                                        <i class="fa fa-lock"></i>
                                    </div>
                                    <input name="tenancyName" type="text" class="form-control" placeholder="Tenancy name" value="">
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="form-group">
                                <div class="input-group ">
                                    <div class="input-group-addon">
                                        <i class="fa fa-hospital-o"></i>
                                    </div>
                                    <input name="tenancyName" type="text" class="form-control" placeholder="Tenancy name" value="">
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-addon">
                                        <i class="fa fa-lock"></i>
                                    </div>
                                    <input name="tenancyName" type="text" class="form-control" placeholder="Tenancy name" value="">
                                </div>
                            </div>
                        </li>

                    </ul>
                    <ul class="third-part">
                        <li>
                            <a href="#" class="facebook">
                                <div class="icon-wrapper">
                                    <i class="fa fa-facebook"></i>
                                </div>
                                <div class="content">
                                    <span>Sign up with
                                        <strong>Facebook</strong>
                                    </span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="#" class="googleplus">
                                <div class="icon-wrapper">
                                    <i class="fa fa-google-plus"></i>
                                </div>
                                <div class="content">
                                    <span>Sign up with
                                        <strong>Google+</strong>
                                    </span>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    data() {
        return {
            Year: new Date().getFullYear()
        };
    },
    mounted() {
        this.$nextTick(() => {
            $('.tab-panel').height($('.sign-in-tab').height());

            $('a[name=tab]').click(function() {
                $('.login-tabs>li').removeClass('current');
                $(this)
                    .parent('li')
                    .addClass('current');
                $('.tab-item').removeClass('tab-item-transform');
                var clsName = $(this).attr('class');

                $('.' + clsName + '-tab').addClass('tab-item-transform');
                $('.tab-panel')
                    .addClass('tab-item-transform')
                    .height($('.' + clsName + '-tab').height());
            });
        });
    },
    methods: {}
};
</script>