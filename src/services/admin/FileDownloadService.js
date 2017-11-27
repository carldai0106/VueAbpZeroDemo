import config from '../../common/config';
class FileDownloadService {
    downloadTempFile(file) {
        const url =
            config.remoteUrl +
            '/File/DownloadTempFile?fileType=' +
            file.fileType +
            '&fileToken=' +
            file.fileToken +
            '&fileName=' +
            file.fileName;
        location.href = url;
        // TODO: This causes reloading of same page in Firefox
    }
}

export default new FileDownloadService();
