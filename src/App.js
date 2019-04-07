import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Scanner from './quagga/Scanner';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      results: [],
      appele: false
    };
    this._onDetected = this._onDetected.bind(this);
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  _onDetected(result) {
    const estNouveau = this.state.results.filter(
      r => r.resultat.codeResult.code === result.codeResult.code
    ).length === 0
      ? true
      : false;
    if (estNouveau) {
      this.setState({
        results: [...this.state.results, { resultat: result, nombre: 1 }]
      });
    } else {
      var nouveauResultats = [...this.state.results];
      nouveauResultats.forEach(r => {
        if (r.resultat.codeResult.code === result.codeResult.code) {
          r.nombre += 1;
        }
      });
      this.setState({
        results: nouveauResultats
      });
    }
  }

  render() {
    const javascriptBarcodeReader = require('javascript-barcode-reader');
    javascriptBarcodeReader(
      {
        tagName: 'CANVAS'
      } /* Image file Path || {data: pixelArray, width, height} || HTML5 Canvas ImageData */,
      {
        barcode: 'ean-13',
        type: 'industrial' //optional type
      }
    )
      .then(code => {
        console.log(code);
      })
      .catch(err => {
        console.log(err);
      });

    return (
      <React.Fragment>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleClickOpen}
        >
          scanner

        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'Scan du code barre'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <ul>
                {this.state.results.map(r => (
                  <li>{r.resultat.codeResult.code} </li>
                ))}
              </ul>
              <Scanner onDetected={this._onDetected} />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Annuler
            </Button>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Terminer
            </Button>
          </DialogActions>
        </Dialog>

      </React.Fragment>
    );
  }
}

export default App;
