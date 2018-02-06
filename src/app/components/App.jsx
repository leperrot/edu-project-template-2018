import React, { Component, PropTypes } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { Provider } from 'react-redux';
import configure from './store';

const store = configure();

class EpisodeItemComponent extends Component {

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
                        <tr>
                            <td>{JSON.parse(episode).name}</td>
                            <td>{JSON.parse(episode).code}</td>
                            <td>{JSON.parse(episode).note}</td>
                        </tr>
                    )}
            </tbody>
        </table>);
    }
}

class Swag extends Component{
    render(){
        return(
            <h1>Bonjour</h1>
        );
    }
}


export default class App extends Component {
    render(){
        return (
            <Provider store={store}>
                <Router>
                  <div>
                    <Route path="/" component={EpisodeItemComponent}>
                    </Route>
                    <Route path="/new" component={Swag}>
                    </Route>
                  </div>
                </Router>
            </Provider>
        );
    }
};
