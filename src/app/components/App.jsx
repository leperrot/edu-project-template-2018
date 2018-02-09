import React, { Component, PropTypes } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { Provider } from 'react-redux';
import configure from './store';

const store = configure();

class EpisodeItemComponent extends Component{

    constructor(props){
        super(props);
    }

    render() {
        return(
            <tr>
                <td>{this.props.episode.name}</td>
                <td>{this.props.episode.code}</td>
                <td>{this.props.episode.note}</td>
            </tr>
        );
    }
}

class EpisodeListComponent extends Component {

    constructor(props){
        super(props);

        this.state = {
            episodes: []
        };
    }

    componentDidMount(){
        fetch("/api/episodes")
            .then(function(response){
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json();
            })
            .then((data) => {
                this.setState({ episodes: data });
            });
    }

    render(){
        let episodes = this.state.episodes;
        return(
            <table>
                <thead>
                    <tr>
                        <td>Nom</td>
                        <td>Code</td>
                        <td>Note</td>
                    </tr>
                </thead>
                <tbody>
                        {episodes.map(episode =>
                            <EpisodeItemComponent episode={JSON.parse(episode)}/>
                        )}
                </tbody>
            </table>
        );
    }
}

class EpisodeFormComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            name: "",
            code: "",
            note: 0
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event){
        fetch("/api/episodes", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        }).then(function(response){
            window.location.reload();
        });
    }

    handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render(){
        return(
            <form method="post" onSubmit={this.handleSubmit}>
                <label for="name">Serie</label>
                <br/>
                <input type="text" id="name" name="name" value={this.state.name} placeholder="Serie" onChange={this.handleChange}/>
                <br/>
                <label for="code">Code Episode</label>
                <br/>
                <input type="text" id="code" name="code" value={this.state.code} placeholder="S00E00" onChange={this.handleChange}/>
                <br/>
                <label for="note">Note</label>
                <br/>
                <input type="number" id="note" name="note" min="0" max="10" value={this.state.note} onChange={this.handleChange}/>
                <br/>
                <input type="submit" value="Watched"/>
            </form>
        )
    }
}

class EpisodeComponent extends Component {

    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <EpisodeListComponent/>
                <br/>
                <EpisodeFormComponent/>
            </div>
        );
    }

}

export default class App extends Component {
    render(){
        return (
            <Provider store={store}>
                <Router>
                  <div>
                    <Route path="/" component={EpisodeComponent}>
                    </Route>
                  </div>
                </Router>
            </Provider>
        );
    }
};
