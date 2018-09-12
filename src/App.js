import React, { Component } from 'react';
import { Row, Col, Layout, Button } from 'antd';
import DevTools from 'mobx-react-devtools'
import './App.css';
import InputForm from './components/InputForm/inputForm';
import MyCalendar from './components/Calendar/calendar';
import EventsTable from './components/EventsTable/eventsTable'
import EventModal from './components/EventModal/eventModal'

const { Content, Footer } = Layout;

class App extends Component {
  render() {
    return (
      <div className="App">
        <Layout>
          <Content style={{ padding: '50px' }}>
            <Row>
                <Col span={12}>
                  <EventsTable />
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
        <EventModal />
      </div>
    );
  }
}

export default App;
