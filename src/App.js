import React, { Component } from 'react';
import { Row, Col, Layout } from 'antd';
import DevTools from 'mobx-react-devtools'
import './App.css';
import InputForm from './components/InputForm/inputForm';
import MyCalendar from './components/Calendar/calendar';


const { Content, Footer } = Layout;

class App extends Component {
  render() {
    return (
      <div className="App">
        <Layout>
          <Content style={{ padding: '0 50px' }}>
            <Row>
                <InputForm />
            </Row>
            <Row>
                <Col span={12}>
                </Col>
                <Col span={12}>
                    <MyCalendar />
                </Col>
            </Row>
            <DevTools position={{ bottom: 0, right: 20 }} />
          </Content>
          <Footer style={{ textAlign: 'center' }}>
              Created by Stoge
          </Footer>
        </Layout>
      </div>
    );
  }
}

export default App;
