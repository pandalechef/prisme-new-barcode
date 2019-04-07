import React from 'react';
import Quagga from 'quagga';

export default class Scanner extends React.Component {
  constructor(props) {
    super(props);
    this._onDetected = this._onDetected.bind(this);
  }

  componentDidMount() {
    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          constraints: {
            width: 640,
            height: 480,
            facingMode: 'environment' // or user
          }
        },
        numOfWorkers: navigator.hardwareConcurrency || 2,
        decoder: {
          readers: ['ean_reader'],
          multiple: false
        }
      },
      function(err) {
        if (err) {
          console.log('Erreur au init');
          return console.log(err);
        }
        Quagga.start();
      }
    );
    Quagga.onDetected(this._onDetected);
  }

  componentWillUnmount() {
    Quagga.offDetected(this._onDetected);
  }

  _onDetected(result) {
    console.log('onDetected ', result);
    this.props.onDetected(result);
  }

  render() {
    return <div id="interactive" className="viewport" />;
  }
}
