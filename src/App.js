import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import mainLogo from'./SYF.png';
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import React, { useState } from "react";
import abi from "./utils/ERC721Identifier.json";
import { ethers } from "ethers";
import './App.css';
import { render } from '@testing-library/react';


let deployerSK = process.env.REACT_APP_DEPLOYER_PRIVATE;

deployerSK = hexToBytes(deployerSK);

const contractAddress= '0xb8E16DDcaF389C84B61C56ab8B0A88E57ACe9053';
const contractABI = abi.abi;
const provider = new ethers.providers.JsonRpcProvider('https://eth-goerli.alchemyapi.io/v2/E5Ogmdfcb9fdjqsW3zNW3ab93X8m1Ihy');

const Synchrony = new ethers.Wallet(deployerSK, provider);

//creating a new contract "instance" with Synchrony as the signer

const identifierContract = new ethers.Contract(contractAddress, contractABI, Synchrony);

function hexToBytes(hex) {
  if (!hex) {
    return []
  } else {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
  }
}

function createJsonObject(walletaddress, firstname, middlename, lastname, address, unit, city, state, zip, email, phone, ssn, birthdate) {
  const idinfo = {
    walletAddress: walletaddress,
    firstName: firstname,
    middlename: middlename,
    lastName: lastname,
    address: address,
    unit: unit,
    city: city,
    state: state,
    zip: zip,
    email: email,
    phone: phone,
    ssn: ssn, 
    _birthdate: birthdate
  } 
  const jsonidinfo = JSON.stringify(idinfo);
  return jsonidinfo;
}

const createNFT = async(walletAddress) => {
  try {
    console.log("going to mint to wallet walletAddress", walletAddress);
    const mintTxn = await identifierContract.mint(walletAddress);
    await console.log("Creating the NFT with hash: ", mintTxn.hash);
    await mintTxn.wait();
    console.log("Done! Another?")
    render(
      <div>
      <h2>Created an NFT with hash {mintTxn.hash}!  Check it out on the etherscan (Goerli testnet)</h2>
      <p>Your ID is # {(await identifierContract.totalSupply()).toNumber()} in the digital ID collection</p>
      <p>If you would like to create another digital ID, please reload the page</p>
      </div>
    )
    } catch (e) {
      console.error(e)
      throw e;
    }
}

function PersonalDataForm() {
  const [validated, setValidated] = useState(false);
  const [checkBoxState, setCheckBoxState] = useState(false);
  const [displayform, setDisplayForm] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [unit, setUnit] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ssn, setSSN] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  // const [totalIds, setTotalIDs] = useState(0);
  
    const handleSubmit = async(event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      setDisplayForm(false);
      // const ipfs = IPFS.create();
      // const {cid} = ipfs.add('Hello World');
      // console.info(cid);
      // code to pop up window / loading while the nft is created

      // first we must create a json object from the data in our form
      let lowerCaseWalletAddress = walletAddress.toLowerCase();
      console.log("Going to create JSON object entry with " + lowerCaseWalletAddress);
      const jsonid = createJsonObject(lowerCaseWalletAddress, firstName, middleName, lastName, address, unit, city, state, zip, email, phone, ssn, birthdate);

      // format the POST request

      let xhr = new XMLHttpRequest();
      xhr.open("POST", "https://identifier-database.getsandbox.com:443/identifiers");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = function() {
        if (this.status === 200) {
          console.log("Successfully created NFT and the record for it.");
        } else {
          console.log(xhr.responseText);
        }
      }
      try {
         await createNFT(walletAddress);
        // if no error is thrown by createNFT, then we send the json to the server.
        xhr.send(jsonid);;
      } catch (e) {
        console.log("An error occurred creating your NFT.  Make sure that this wallet does not already contain a digital Id.")
      }
    }
    setValidated(true);
    // let temp = await identifierContract.totalSupply();
    // console.log((temp.toNumber()));
    // setTotalIDs(temp.toNumber());
  };
  
  return(
    displayform && (
      <>
    <Form noValidate validated = {validated} onSubmit = {handleSubmit} >
      <Row className="mb-3">
        <Form.Group as={Col} controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control required type="firstName" placeholder="Micheal" onChange={event => setFirstName(event.target.value)} />
          <Form.Control.Feedback type="invalid">
              Please enter first name
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} controlId="middleName">
          <Form.Label>Middle Name (Optional)</Form.Label>
          <Form.Control type="middleName" placeholder="Gary" onChange={event => setMiddleName(event.target.value)} />
        </Form.Group>
          <Form.Group as={Col} controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control required type="lastName" placeholder="Scott" onChange={event => setLastName(event.target.value)} />
            <Form.Control.Feedback type="invalid">
              Please enter last name
            </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Row>
        <Form.Group  as = {Col} className="mb-3" controlId="formGridAddress1">
          <Form.Label>Address</Form.Label>
          <Form.Control required placeholder="1234 Main St" onChange={event => setAddress(event.target.value)} />
          <Form.Control.Feedback type="invalid">
              Please enter an address
            </Form.Control.Feedback>
        </Form.Group>

        <Col xs = "auto">
          <Form.Group className="mb-3" controlId="formGridAddress2">
            <Form.Label>Unit # (Optional)</Form.Label>
            <Form.Control placeholder="#328" onChange={event => setUnit(event.target.value)} />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridCity">
          <Form.Label>City</Form.Label>
          <Form.Control required placeholder= "Scranton" onChange={event => setCity(event.target.value)} />
          <Form.Control.Feedback type="invalid">
              Please enter a city
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>State</Form.Label>
          <Form.Select required defaultValue="" onChange={event => setState(event.target.value)} >
            <option value="??">Select State</option>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="CT">Connecticut</option>
            <option value="DE">Delaware</option>
            <option value="DC">Dist of Columbia</option>
            <option value="FL">Florida</option>
            <option value="GA">Georgia</option>
            <option value="HI">Hawaii</option>
            <option value="ID">Idaho</option>
            <option value="IL">Illinois</option>
            <option value="IN">Indiana</option>
            <option value="IA">Iowa</option>
            <option value="KS">Kansas</option>
            <option value="KY">Kentucky</option>
            <option value="LA">Louisiana</option>
            <option value="ME">Maine</option>
            <option value="MD">Maryland</option>
            <option value="MA">Massachusetts</option>
            <option value="MI">Michigan</option>
            <option value="MN">Minnesota</option>
            <option value="MS">Mississippi</option>
            <option value="MO">Missouri</option>
            <option value="MT">Montana</option>
            <option value="NE">Nebraska</option>
            <option value="NV">Nevada</option>
            <option value="NH">New Hampshire</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="NC">North Carolina</option>
            <option value="ND">North Dakota</option>
            <option value="OH">Ohio</option>
            <option value="OK">Oklahoma</option>
            <option value="OR">Oregon</option>
            <option value="PA">Pennsylvania</option>
            <option value="RI">Rhode Island</option>
            <option value="SC">South Carolina</option>
            <option value="SD">South Dakota</option>
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            <option value="UT">Utah</option>
            <option value="VT">Vermont</option>
            <option value="VA">Virginia</option>
            <option value="WA">Washington</option>
            <option value="WV">West Virginia</option>
            <option value="WI">Wisconsin</option>
            <option value="WY">Wyoming</option>
          </Form.Select>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridZip">
          <Form.Label>Zip</Form.Label>
          <Form.Control required placeholder= "18503" onChange={event => setZip(event.target.value)} />
          <Form.Control.Feedback type="invalid">
              Please enter zipcode
            </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col} controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control required placeholder = "MichealScott@gmail.com" onChange={event => setEmail(event.target.value)} />
          <Form.Control.Feedback type="invalid">
              Please enter email
            </Form.Control.Feedback>
          <br></br>
        </Form.Group>

        <Col xs = "auto">
          <Form.Group controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control required placeholder= "9999999999" onChange={event => setPhone(event.target.value)} />
            <Form.Control.Feedback type="invalid">
              Please enter phone number
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Form.Group as={Col} controlId="formSocialSecurity">
            <Form.Label>Social Security Number</Form.Label>
            <Form.Control required placeholder= "123-45-6789" onChange={event => setSSN(event.target.value)} />
            <Form.Control.Feedback type="invalid">
              Please enter social security
            </Form.Control.Feedback>
          <br></br>
          </Form.Group>

        <Col xs = "auto">
        <Form.Group controlId="formBirthDate">
            <Form.Label>Birthdate</Form.Label>
            <Form.Control required placeholder= "MM/DD/YYYY" onChange={event => setBirthdate(event.target.value)} />
          <Form.Control.Feedback type="invalid">
              Please enter birthdate
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3" id="formGridCheckbox">
        <Form.Check onChange={event => setCheckBoxState(!checkBoxState)}type="checkbox" label="Check this box if you want a digital Synchrony ID allowing passwordless authentication"/>
      </Form.Group>
          {checkBoxState === true && (          
            <>
          <Form.Group controlId="formPublicAddress">
            <Form.Label>Eth Wallet Address</Form.Label>
            <Form.Control required placeholder= "0xAd. . . " onChange={event => setWalletAddress(event.target.value)} />
            <Form.Control.Feedback type="invalid">
              Please enter Wallet Address
            </Form.Control.Feedback>
            <br></br>
          </Form.Group>
            
            </>
          )
          }

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
      </>
      )
      )
}

function App() {
  return (
    <div className="App">
  <Navbar variant='dark' bg='dark' sticky = 'top'>
    <div className= 'navbarContainer'>
      <div className = "imgContainer">
        <Navbar.Brand href="#home">
          <img src= {mainLogo} width='35' height='35' alt = 'synchrony               logo'className="d-inline-block align-top"
          />{' '}
          Synchrony (FOR TESTING PURPOSES, DONT ENTER YOUR REAL INFO)
        </Navbar.Brand>
      </div>  
    </div>
  </Navbar>
  <div className= "directionsContainer">
    Fill out the form to apply for an account/card!
  </div>
  <div className="formContainer">  
      {PersonalDataForm()}
  </div>
</div>
  );
}

export default App;
