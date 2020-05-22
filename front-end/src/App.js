import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  state = {
    todoList: [],
    activeItem: {
      id: null,
      title: "",
      completed: false,
    },
    editing: false,
  };

  getToken(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  componentWillMount() {
    this.fetchTask();
  }

  fetchTask = () => {
    console.log("fetching data...");
    fetch("http://127.0.0.1:8000/api/task-list/")
      .then((response) => response.json())

      .then((data) =>
        this.setState({
          todoList: data,
        })
      );
  };

  handleChange = (e) => {
    var name = e.target.name;
    var value = e.target.value;

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value,
      },
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.activeItem);

    var csrftoken = this.getToken("csrftoken");

    var url = "http://127.0.0.1:8000/api/task-create/";

    if (this.state.editing === true) {
      url = "http://127.0.0.1:8000/api/task-update/";
      url = url + this.state.activeItem.id;
      console.log(url);
      this.setState({
        editing: false,
      });
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(this.state.activeItem),
    })
      .then((response) => {
        this.fetchTask();
        this.setState({
          activeItem: {
            id: null,
            title: "",
            completed: false,
          },
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  startEdit = (task) => {
    this.setState({
      editing: true,
      activeItem: task,
    });
  };

  deleteItem = (task) => {
    var csrftoken = this.getToken("csrftoken");

    var url = "http://127.0.0.1:8000/api/task-delete/";
    url = url + task.id;

    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    }).then((response) => {
      this.fetchTask();
    });
  };

  strikeUnstrike = (task) => {
    task.completed = !task.completed;

    var csrftoken = this.getToken("csrftoken");

    var url = "http://127.0.0.1:8000/api/task-update/";
    url = url + task.id;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ completed: task.completed, title: task.title }),
    }).then((response) => this.fetchTask());
  };

  render() {
    return (
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form onSubmit={this.handleSubmit} id="form">
              <div className="flex-wrapper">
                <div style={{ flex: 6 }}>
                  <input
                    onChange={this.handleChange}
                    className="form-control"
                    id="title"
                    type="text"
                    name="title"
                    value={this.state.activeItem.title}
                    placeholder="New Task"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    id="submit"
                    className="btn btn-warning"
                    type="submit"
                    name="Add"
                  />
                </div>
              </div>
            </form>
          </div>

          <div id="list-wrapper">
            {this.state.todoList.map((task) => (
              <div key={task.id} className="task-wrapper flex-wrapper">
                <div style={{ flex: 7 }}>
                  <div onClick={() => this.strikeUnstrike(task)}>
                    {task.completed == false && <span>{task.title}</span>}
                    {task.completed == true && <strike>{task.title}</strike>}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <span>
                    <button
                      onClick={() => this.startEdit(task)}
                      className="btn btn-sm btn-outline-info"
                    >
                      edit
                    </button>
                  </span>
                </div>

                <div style={{ flex: 1 }}>
                  <span>
                    <button
                      onClick={() => this.deleteItem(task)}
                      className="btn btn-sm btn-outline-dark delete"
                    >
                      -
                    </button>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
