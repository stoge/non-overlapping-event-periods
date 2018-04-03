import React, { Component } from 'react';
import { Row, Col } from 'antd'
import './App.css';
import InputForm from './components/InputForm/inputForm'
import MyCalendar from './components/Calendar/calendar'

class App extends Component {
  render() {
    return (
      <div className="App">
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
      </div>
    );
  }
}

export default App;
