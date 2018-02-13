import React, { Component, PropTypes } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { Provider } from 'react-redux';
import configure from './store';
import createBrowserHistory from 'history/createBrowserHistory';

const history = createBrowserHistory();

const store = configure();

class DeleteComponent extends Component{

    constructor(props){
        super(props);
    }

    deleteEp(){
        fetch("/api/episodes/"+this.props.epId, {
            method: "DELETE"
        })
        .then(function(response){
            window.location.reload();
        }, function(err){
            window.location.reload();
        });
    }

    render(){
        return(
            <td>
                <button type="button" onClick={() => this.deleteEp()}>X</button>
            </td>
        );
    }
}

class EpisodeItemComponent extends Component{

    constructor(props){
        super(props);
    }

    render() {
        return(
            <tr>
                <td><a href={"/"+this.props.episode.id}>{this.props.episode.name}</a></td>
                <td>{this.props.episode.code}</td>
                <td>{this.props.episode.note}</td>
                <DeleteComponent epId={this.props.episode.id}/>
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
                        <td></td>
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

class ButtonComponent extends Component {

    constructor(props){
        super(props);
    }

    create(){
        fetch("/api/episodes", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.props.episode)
        }).then(function(response){
            window.location.reload();
        }, function(err){
            window.location.reload();
        });
    }

    render(){
        return(
            <button type="button" onClick={() => this.create()}>Watched</button>
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
            <form>
                <label htmlFor="name">Serie</label>
                <br/>
                <input type="text" id="name" name="name" value={this.state.name} placeholder="Serie" onChange={this.handleChange}/>
                <br/>
                <label htmlFor="code">Code Episode</label>
                <br/>
                <input type="text" id="code" name="code" value={this.state.code} placeholder="S00E00" onChange={this.handleChange}/>
                <br/>
                <label htmlFor="note">Note</label>
                <br/>
                <input type="number" id="note" name="note" min="0" max="10" value={this.state.note} onChange={this.handleChange}/>
                <br/>
                <ButtonComponent episode={this.state}/>
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

class UpdateEpisodeComponent extends Component{

    constructor(props) {
        super(props);
        this.state = {
            episode: {}
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount(){
        this.setState({
            episode: this.props.episode
        });
    }

    handleChange(event){
        let episode = {
            id: this.state.episode.id,
            name: this.state.episode.name,
            code: this.state.episode.code,
            note: event.target.value
        };
        this.setState({episode: episode});
    }

    update(){
        fetch("/api/episodes/"+this.state.episode.id, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.episode)
        })
        .then(() => {
            //history.push('/');
            window.location.reload();
        });
    }

    render(){
        return(
            <form>
                <label htmlFor="note">Note</label>
                <br/>
                <input type="number" id="note" name="note" min="0" max="10" value={this.state.episode.note} onChange={this.handleChange}/>
                <br/>
                <button type="button" onClick={() => this.update()}>Valider</button>
            </form>
        )
    }

}

class EpisodeDetailComponent extends Component{

    constructor(props){
        super(props);
        this.state = {
            id: props.match.params.id,
            episode: null
        };
    }

    componentDidMount() {
        fetch("/api/episodes/" + this.state.id)
            .then(function (res) {
                return res.json();
            }, function (err) {
                throw new Error("Bad response from server");
            })
            .then((data) => {
                this.setState({
                    id: this.state.id,
                    episode: data
                });
            });
    }

    render() {
        let update = null;
        if(this.state.episode != null){
            update = (
                <div>
                    <h3>{this.state.episode.name}</h3>
                    <h4>{this.state.episode.code}</h4>
                    <UpdateEpisodeComponent episode={this.state.episode}/>
                </div>
            );
        }
        return(
            <div>
                { update }
            </div>
        );
    }
}

export default class App extends Component {
    render(){
        return (
            <Provider store={store}>
                <Router history={history}>
                  <div>
                    <Route path="/" component={EpisodeComponent}>
                    </Route>
                    <Route path="/:id" component={EpisodeDetailComponent}>
                    </Route>
                  </div>
                </Router>
            </Provider>
        );
    }
};
