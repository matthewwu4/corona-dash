import React from "react";
import Axios from "axios";
import "./AppStyle.css";

const formatter = new Intl.NumberFormat('en');

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            NewConfirmed: 0,
            TotalConfirmed: 0,
            NewDeaths: 0,
            TotalDeaths: 0,
            NewRecovered: 0,
            TotalRecovered: 0,
            Countries: []
        }
    }

    componentDidMount() {
        this.getData();
    }

    async getData() {
        const response = await Axios.get("https://api.covid19api.com/summary");

        const resCountries = await Axios.get("https://api.covid19api.com/countries");
        //const Countries = Object.keys(resCountries.data[0]);

        this.setState({
            NewConfirmed: response.data.Global.NewConfirmed,
            TotalConfirmed: response.data.Global.TotalConfirmed,
            NewDeaths: response.data.Global.NewDeaths,
            TotalDeaths: response.data.Global.TotalDeaths,
            NewRecovered: response.data.Global.NewRecovered,
            TotalRecovered: response.data.Global.TotalRecovered,
            
        });

        var x = 0;
        for(x in resCountries.data) {
            var joined = this.state.Countries.concat(resCountries.data[x].Country).sort();
            this.setState({ Countries: joined });
        }
    }

    async handleChange(event) {
        console.log(event.target.value);
        var chosenCountry = event.target.value;

        if(chosenCountry === "Global") {
            return this.getData();
        }

        const countryData = await Axios.get('https://api.covid19api.com/summary');
        var countryData2 = "";

        for(var i = 0; i < 186; ++i) {
            if(countryData.data.Countries[i].Country === chosenCountry) {
                countryData2 = countryData.data.Countries[i]
            }
        }

        this.setState({
            NewConfirmed: countryData2.NewConfirmed,
            TotalConfirmed: countryData2.TotalConfirmed,
            NewDeaths: countryData2.NewDeaths,
            TotalDeaths: countryData2.TotalDeaths,
            NewRecovered: countryData2.NewRecovered,
            TotalRecovered: countryData2.TotalRecovered,
        });
      }

    renderCountryOptions() {
        return this.state.Countries.map((country, i) => {
            return <option key={i}>{country}</option>
        })
    }

    render() {
        return(
            <div>
             <h1 className="title">Corona Dash</h1>

             <div className="drop">
                <select onChange={this.handleChange}>
                    <option>Global</option>
                    {this.renderCountryOptions()}
                </select>
            </div>

            <div className="dataDisplay">

            <div className="dataDisplayOne">
            <div>
                <div style={{paddingBottom:"10px"}}>
                <h3>New Confirmed</h3>
                <h4>{formatter.format(this.state.NewConfirmed)}</h4>
                </div>
            </div>  
            <div> 
                <div style={{paddingBottom:"10px"}}>
                <h3>New Deaths</h3>
                <h4>{formatter.format(this.state.NewDeaths)}</h4>
                </div>
            </div>  
            <div> 
                <h3>New Recovered</h3>
                <h4>{formatter.format(this.state.NewRecovered)}</h4>
            </div>
            </div>

            <div className="dataDisplayTwo">
            <div>
                <div style={{paddingBottom:"10px"}}>
                <h3>Total Confirmed</h3>
                <h4>{formatter.format(this.state.TotalConfirmed)}</h4>
                </div>
            </div>
            <div>
                <div style={{paddingBottom:"10px"}}>
                <h3>Total Deaths</h3>
                <h4>{formatter.format(this.state.TotalDeaths)}</h4>
                </div>
            </div>
            <div>
                <h3>Total Recovered</h3>
                <h4>{formatter.format(this.state.TotalRecovered)}</h4>
            </div>
            </div>
            
            </div>

            </div>
        );
    }
}