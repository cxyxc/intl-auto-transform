import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Upload, Icon, message} from 'antd';
import {API} from '../constants';
import styles from './style.css';

const basePath = fetch.basePath || '';

class ImageUpload extends PureComponent {
    state = {
        loading: false
    }
    handleChange = ({file}) => {
        const {getString} = this.props;
        if(file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if(file.status === 'done') {
            const fileInfo = file.response.payload[0];
            this.setState({
                loading: false
            });
            this.props.onChange(fileInfo);
            message.success(getString('UPLOAD_PICTURES_SUCCESS'));
            return;
        }
        if(file.status === 'error') {
            this.setState({
                loading: false
            });
            message.error(getString('UPLOAD_PICTURES_FAILED'));
            return;
        }
    }
    render() {
        const {getString} = this.props;

        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const fileId = this.props.fileId;
        const imageUrl = fileId && `${basePath}${API.files}/${fileId}`;
        return (
            <Upload
                name="file"
                listType="picture-card"
                accept="image/*"
                showUploadList={false}
                action={`${basePath}${API.files}`}
                onChange={this.handleChange}>
                {
                    imageUrl
                        ? <img
                            src={imageUrl}
                            alt={getString('HEAD_PORTRAIT')}
                            className={styles.avatar} />
                        : uploadButton
                }
            </Upload>
        );
    }
}

import {localize} from './localize';

ImageUpload.propTypes = {
    getString: PropTypes.func.isRequired,
    fileId: PropTypes.string,
    onChange: PropTypes.func
};

export default localize(ImageUpload);
