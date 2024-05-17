import React from 'react';
import { Layout} from 'antd';
import './AppFooter.style.less';
import {useLayoutContext} from '../../../utility/AppContextProvider/LayoutContextProvider';
import logoFooter from '../../../../assets/logo-a.png'
const {Footer} = Layout;

const AppFooter = () => {
  const {footer} = useLayoutContext();

  if (!footer) {
    return (
      <Footer className='app-main-footer'>
        <p style={{display:"flex",alignItems:"center", gap:"10px"}}>
          Created by: <a rel={"noreferrer"} target={'_blank'} href="https://abduganiev.uz/">
          <img src={logoFooter} alt={'abdugainev logo'} style={{width:'30px',height:"30px", objectFit:'contain'}}/>
        </a>
        </p>

        {/* <div className='footer-btn-view'>
          <Button type='link' className='footer-btn' color='primary'>
            Buy Now
          </Button>
        </div> */}
      </Footer>
    );
  }
  return null;
};

export default AppFooter;
