import React, { Component } from 'react';
import { BrowserBarcodeReader } from '@zxing/library';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});

class BarcodeScanner extends Component {
  constructor(props) {
    super(props);
    this.codeReader = new BrowserBarcodeReader(100);
    this.handleStart = this.handleStart.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.state = {
      videoInputDevices: [],
      selectedDeviceId: null,
      result: null
    };
  }
  handleStart() {
    const { selectedDeviceId } = this.state;
    this.codeReader
      .decodeFromInputVideoDevice(selectedDeviceId, 'video')
      .then(result => {
        const video = document.getElementById('video');
        video.pause();
        this.setState({ result: result.text });
      })
      .catch(err => {
        console.error(err);
      });
    console.log(
      `Started continous decode from camera with id ${selectedDeviceId}`
    );
  }
  handleReset() {
    this.codeReader.reset();
    console.log('Reset.');
  }

  componentDidMount() {
    this.codeReader
      .getVideoInputDevices()
      .then(videoInputDevices => {
        this.setState({
          videoInputDevices: videoInputDevices,
          selectedDeviceId: videoInputDevices[1].deviceId
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  handleChange = event => {
    this.setState({ selectedDeviceId: event.target.value });
  };

  render() {
    const { videoInputDevices, selectedDeviceId, result } = this.state;
    if (selectedDeviceId === null) {
      return <div>Attendez</div>;
    }
    const { classes } = this.props;
    return (
      <main>
        <section id="demo-content">
          <h1>Scan barcode from Video Camera</h1>
          <div>
            <button onClick={this.handleStart}>Scanner</button>
            <button onClick={this.handleReset}>Arrêter</button>
          </div>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="camera">Camera</InputLabel>
            <Select
              value={selectedDeviceId}
              onChange={this.handleChange}
              inputProps={{
                name: 'camera',
                id: 'camera'
              }}
            >
              {videoInputDevices.map(elt => (
                <MenuItem key={elt.deviceId} value={elt.deviceId}>
                  {elt.label}
                </MenuItem>
              ))}

            </Select>
          </FormControl>
          <div>
            <video id="video" width="600" height="400" />
          </div>
          {result && <h1>Résultat: {result}</h1>}
        </section>
      </main>
    );
  }
}

export default withStyles(styles)(BarcodeScanner);
