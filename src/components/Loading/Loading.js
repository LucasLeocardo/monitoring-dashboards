import './loading.css';
import loading from '../../assets/loader.svg';
import PropTypes from 'prop-types';

function Loading(props) {
    const { hasMarginTop } = props;

    return (
        <div className={hasMarginTop ? 'loaderContainerMarginTop' : 'loaderContainer'}>
            <img src={loading} alt='Loading' />
        </div>
    );
}

export default Loading;

Loading.propTypes = {
    hasMarginTop: PropTypes.bool
};