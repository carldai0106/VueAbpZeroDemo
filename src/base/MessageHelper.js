import swal from 'sweetalert2';

class MessageHelper {
    constructor() {
        var self = this;
        abp.event.on('abp.dynamicScriptsInitialized', function() {
            self.config.confirm.title = abp.localization.abpWeb('AreYouSure');
            self.config.confirm.cancelButtonText = abp.localization.abpWeb(
                'Cancel'
            );
            self.config.confirm.confirmButtonText = abp.localization.abpWeb(
                'Yes'
            );
        });
    }

    config = {
        info: {
            type: 'info'
        },
        sucess: {
            type: 'success'
        },
        warning: {
            type: 'warning'
        },
        error: {
            type: 'error'
        },
        question: {
            type: 'question'
        },
        default: {},
        confirm: {
            title: 'Are you sure?',
            text: 'You will not be able to recover this imaginary file!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel'
        }
    };

    showMessage(type, title, message) {
        if (!title) {
            title = message;
            message = undefined;
        }
        var options = $.extend({}, this.config[type], {
            title: title,
            text: message
        });

        options.onClose = function() {};
        return swal(options);
    }

    info(title, message) {
        return this.showMessage('info', title, message);
    }

    success(title, message) {
        return this.showMessage('success', title, message);
    }

    warning(title, message) {
        return this.showMessage('warning', title, message);
    }

    error(title, message) {
        return this.showMessage('error', title, message);
    }

    question(title, message) {
        return this.showMessage('question', title, message);
    }

    confirm(title, message, onfulfilled, onrejected) {
        var options = $.extend({}, this.config.confirm, {
            title: title,
            text: message
        });
        if (!onrejected) {
            onrejected = () => {};
        }
        return swal(options).then(onfulfilled, onrejected);
    }
}

export default new MessageHelper();
