// Written by Bradley James Dettmer

var Button = ReactBootstrap.Button;
var FormControl = ReactBootstrap.FormControl;
var FormGroup = ReactBootstrap.FormGroup;

var Stock = React.createClass({
  render: function() {
      return (
          <div className="stock">
              <h3 className="stockName">{this.props.name}: {this.props.price} USD</h3>
              <div className="stockDescription">{this.props.description}</div>
              <div className="stockDetails">
                Is Taxable: {this.props.isTaxable}<br />
                Available: {this.props.availableDate}<br />
              </div>
          </div>
      );
  }
});

var StockBox = React.createClass({
    loadStocksFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleStockSubmit: function (stock) {
        var stocks = this.state.data;
        stock.id = Date.now();
        var newStocks = stocks.concat([stock]);
        this.setState({data: newStocks});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: stock,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({data: stocks});
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadStocksFromServer();
        setInterval(this.loadStocksFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="stockBox container">
                <h1>Stock Item Tracker</h1>
                <StockForm onStockSubmit={this.handleStockSubmit}/>
                <StockList data={this.state.data} />
            </div>
        );
    }
});

var StockList = React.createClass({
    render: function() {
        var stockNodes = this.props.data.map(function(stock) {
            return (
                <Stock
                    key={stock.id}
                    name={stock.name}
                    description={stock.description}
                    price={stock.price}
                    availableDate={stock.availableDate}
                    isTaxable={stock.isTaxable}>
                </Stock>
            );
        });
        return (
            <div className="stockList">
                {stockNodes}
            </div>
        );
    }
});

function FormTextFieldGroup({id, value, placeholder, changeHandler, focusHandler}) {
    return (
        <FormGroup controlId={id}>
            <FormControl
                type="text"
                value={value}
                placeholder={placeholder}
                onFocus={focusHandler}
                onChange={changeHandler}
            />
        </FormGroup>
    );
}

var StockForm = React.createClass({
    getInitialState: function() {
        return {
            name: '',
            description:'',
            price:'',
            availableDate:'',
            isTaxable:'yes',
            selectedDay: new Date(),
            showDayPicker: false
        };
    },
    handleNameFieldChange: function(e) {
        this.setState({name: e.target.value, showDayPicker: false});
    },
    handleDescriptionFieldChange: function(e) {
        this.setState({description: e.target.value, showDayPicker: false});
    },
    handlePriceFieldChange: function(e) {
        this.setState({price: e.target.value, showDayPicker: false});
    },
    handleDayClick: function(e, day) {
        this.setState({availableDate: day.toLocaleDateString(), selectedDay: day, showDayPicker: false});
    },
    handleDateFieldChange: function(e) {
        this.setState({availableDate: e.target.value});
    },
    handleDateFieldFocus: function() {
        this.setState({showDayPicker: true, availableDate: new Date().toLocaleDateString()});
    },
    handleNonDateFieldFocus: function() {
        this.setState({showDayPicker: false});
    },
    handleTaxableFieldChange: function(e) {
        this.setState({isTaxable: e.target.value, showDayPicker: false});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var name = this.state.name.trim();
        var description = this.state.description.trim();
        var price = this.state.price.trim();
        var availableDate = this.state.availableDate.trim();
        var isTaxable = this.state.isTaxable.trim();
        // Require all fields filled to submit.
        if (!name || !description || !price || !availableDate || !isTaxable) {
            return;
        }
        this.props.onStockSubmit({
            name: name,
            description: description,
            price: price,
            availableDate: availableDate,
            isTaxable: isTaxable
        });
        this.setState({
            name: '',
            description:'',
            price:'',
            availableDate:'',
            isTaxable:'yes',
            selectedDay: new Date(),
            showDayPicker: false});
    },
    render: function() {
        return (
            <form className="stockForm" onSubmit={this.handleSubmit}>
                <FormTextFieldGroup
                    id="NameField"
                    value={this.state.name}
                    placeholder="Name"
                    changeHandler={this.handleNameFieldChange}
                    focusHandler={this.handleNonDateFieldFocus}
                />
                <FormTextFieldGroup
                    id="DescriptionField"
                    value={this.state.description}
                    placeholder="Description"
                    focusHandler={this.handleNonDateFieldFocus}
                    changeHandler={this.handleDescriptionFieldChange}
                />
                <FormTextFieldGroup
                    id="PriceField"
                    value={this.state.price}
                    placeholder="Price in USD"
                    focusHandler={this.handleNonDateFieldFocus}
                    changeHandler={this.handlePriceFieldChange}
                />
                <FormGroup controlId="AvailableDateField">
                    <FormControl
                        type="text"
                        value={this.state.availableDate}
                        placeholder="Available Date"
                        onFocus={this.handleDateFieldFocus}
                        onChange={this.handleDateFieldChange}
                    />
                </FormGroup>
                <DayPicker
                    className={this.state.showDayPicker ? "" : "hidden"}
                    onDayClick={this.handleDayClick}/>
                <FormGroup controlId="formControlsSelect" className="taxableOptions">
                    <FormControl
                        componentClass="select"
                        placeholder="select"
                        onFocus={this.handleNonDateFieldFocus}
                        onChange={this.handleTaxableFieldChange}>
                        <option value="yes">Is Taxable</option>
                        <option value="no">Not Taxable</option>
                    </FormControl>
                </FormGroup>
                <Button type="submit">
                    Submit New Stock
                </Button>
            </form>

        );
    }
});

ReactDOM.render(
    <StockBox url="/api/stock" pollInterval={2000} />,
    document.getElementById('content')
);