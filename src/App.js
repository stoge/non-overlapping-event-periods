import React, { Component } from 'react';
import { Row, Col, Layout, Button } from 'antd';
import DevTools from 'mobx-react-devtools'
import './App.css';
import InputForm from './components/InputForm/inputForm';
import MyCalendar from './components/Calendar/calendar';
import EventsTable from './components/EventsTable/eventsTable'
import EditModal from './components/EditModal/editModal'

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
                  <Button type='primary' style={{
                    marginBottom: '14px'
                  }}>
                    Add new event
                  </Button>
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
        <EditModal />
      </div>
    );
  }
}

export default App;
