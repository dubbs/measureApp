/** @jsx React.DOM */
var data = [
  {category:'toVolume', value:'cups'},
  {category:'toVolume', value:'fluidounces'},
  {category:'toVolume', value:'gallons'},
  {category:'toVolume', value:'liters'},
  {category:'toVolume', value:'milliliters'},
  {category:'toVolume', value:'pints'},
  {category:'toVolume', value:'quarts'},
  {category:'toVolume', value:'tablespoons'},
  {category:'toVolume', value:'teaspoons'},
  {category:'toMass', value:'grams'},
  {category:'toMass', value:'kilograms'},
  {category:'toMass', value:'ounces'},
  {category:'toMass', value:'pounds'},
];

var MeasureApp = React.createClass({
  getInitialState: function() {
    return {
      amountText: '',
      unitValue: 'cups',
      unitConversion: 'toVolume',
      defaultVolume: 'cups',
      defaultMass: 'grams',
      userConversionOverride: false,
      measureInstance: measure()
    };
  },
  handleUserInput: function(amountText) {
    var instance = measure(amountText);
    // no user override yet
    if (!this.state.userConversionOverride) {
      // set to mass
      if (instance.g) {
        this.setState({
          unitConversion: 'toMass',
          unitValue: this.state.defaultMass,
        });
      }
      // set to volume
      else {
        this.setState({
          unitConversion: 'toVolume',
          unitValue: this.state.defaultVolume,
        });
      }
    }

    this.setState({
      amountText: amountText,
      measureInstance: instance
    });
  },
  handleSelectInput: function(unitValue) {
    this.setState({
      unitValue: unitValue,
    });
  },
  handleRadioInput: function(unitConversion) {
    this.setState({
      unitConversion: unitConversion,
      userConversionOverride: true
    });
  },
  render: function() {
    return (
      <div className="measureApp">
        <AmountForm
          onUserInput={this.handleUserInput}
          measureInstance={this.state.measureInstance}
        />
        <UnitForm
          onSelectInput={this.handleSelectInput}
          onRadioInput={this.handleRadioInput}
          amountText={this.state.amountText}
          unitValue={this.state.unitValue}
          unitConversion={this.state.unitConversion}
          data={data}
        />
      </div>
    );
  }
});
var AmountForm = React.createClass({
  handleChange: function() {
    this.props.onUserInput(
      this.refs.amountInput.getDOMNode().value
    );
  },
  render: function() {
    var instance = this.props.measureInstance;
    return (
      <div className="amountForm">
        <label for="amount">Amount: </label>
        <input
          id="amount"
          type="text"
          placeholder="1/2 cup"
          ref="amountInput"
          onChange={this.handleChange}
        />
        <span className="sidebar">

            {instance.g ? instance.g : instance.ml}&nbsp;{instance.g ? 'g' : 'ml'}
        </span>
      </div>
    );
  }
});
var UnitForm = React.createClass({
  // on radio change, set conversion
  handleRadioChange: function() {
    // set unit conversion
    var unitConversion = 'toVolume';
    if (this.refs.unitGroupMass.getDOMNode().checked) {
      unitConversion = 'toMass';
    }
    this.props.onRadioInput(
      unitConversion
    );

    // get first option of type and set as value
    var options = this.props.data
      .filter(function (option) {
        return option.category == unitConversion;
      }.bind(this))

    this.props.onSelectInput(
      options[0].value
    );

  },
  handleSelectChange: function() {
    this.props.onSelectInput(
      this.refs.unitInput.getDOMNode().value
    );
  },
  render: function() {
    // convert to appropriate units
    var measureInstance = measure(this.props.amountText)[this.props.unitConversion]();

    var result;
    if (measureInstance.ml || measureInstance.g) {
      result =  measureInstance[this.props.unitValue]() + ' ' + this.props.unitValue;
    }

    // build options
    var options = this.props.data

      // filter by category
      .filter(function (option) {
        return option.category == this.props.unitConversion;
      }.bind(this))

      // render options
      .map(function (option) {
        return (
          <option value={option.value}>{option.value}</option>
        );
      });

    // render form
    return (
      <div className="unitForm">
        <span className="spacer">as</span><br />
        <label for="units">Units: </label>
        <select
          id="units"
          ref="unitInput"
          value={this.props.unitValue}
          onChange={this.handleSelectChange}
        >
        {options}
      </select>
      <span className="sidebar">
        <label><input type="radio" name="unitGroup" ref="unitGroupVolume" value="volume" defaultChecked onChange={this.handleRadioChange}/>volume</label>
        <label><input type="radio" name="unitGroup" ref="unitGroupMass" value="mass" onChange={this.handleRadioChange}/>mass</label>
      </span>
      <br /><br />
      <div className="result">{result}</div>
    </div>
    );
  }
});
React.renderComponent(
  <MeasureApp />,
  document.getElementById('content')
);
