import React, { useEffect, useState } from "react";
import './App.css';

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDatetime, setEditedDatetime] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editingTransactionId, setEditingTransactionId] = useState(null);

  const [editModes, setEditModes] = useState({});

  const toggleEditMode = (transactionId) => {
    setEditModes((prevEditModes) => ({
      ...prevEditModes,
      [transactionId]: !prevEditModes[transactionId],
    }));
  };


  useEffect(()=> {
    getTransactions().then(transactions => {
      setTransactions(transactions);
    })
  }, [transactions]);
  //added state transactions so that whenever new transactiosn is added page is refreshed and the frontend only updates when page refreshed

  const getTransactions = async() => {
    // this url is to get and display transaction to frontend from posted data in backend and db
    const URL = `${process.env.REACT_APP_API_URL}/transactions`;
    const response = await fetch(URL);
    return await response.json();
  }

  const addNewTransaction = (e) => {
    e.preventDefault();
    // this url is to  post data through from frontend to the backend and db 
    const URL = `${process.env.REACT_APP_API_URL}/transaction`;
                        //separator is space 
    const price = name.split(" ")[0];
    fetch( URL, {
      method: "POST",
      headers: {"Content-type":"application/json"},
      body: JSON.stringify({
        price, 
        name: name.substring(price.length + 1),
        description, 
        datetime
      })
    })
    .then(response => {
      response.json()
      .then(json => {
        setName("");
        setDescription("");
        setDatetime(""); 
        console.log("result", json);
      });
    });
  }

  //Number
  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }

  //String         //two decimal points (including both dollars and cents)
  balance = balance.toFixed(2);
  // to get cents(values after decimal point)
  const cents = balance.split(".")[1];
  //to get only dollar without cents(value before decimal points)
  balance = balance.split(".")[0];

  const updateTransaction = () => {
    alert('update');
  }

  const deleteTransaction = (id) => {
    console.log("id", id);

  fetch(`${process.env.REACT_APP_API_URL}/transaction/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.status === 200) {
        // Transaction deleted successfully.
      } else {
        // Handle errors, e.g., transaction not found, server error, etc.
      }
    })
    .catch((error) => {
      // Handle network errors or other issues.
    });
};



  return (

    <main>

      <h1>Balance : Rs. {balance}.<span>{cents}</span></h1>

      <form onSubmit={addNewTransaction}>

        <div className="basic">
          <input type="text"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 placeholder={"+200 new samsung tv"}
          />
          <input type="datetime-local"
                 value={datetime}
                 onChange={(e) => setDatetime(e.target.value)} 
          />
        </div>

        <div className="description">
          <input type="text"
                 value={description}
                 onChange={(e) => setDescription(e.target.value)} placeholder={"description"} 
          />
        </div>

        <button type="submit">Add new transaction</button>

      </form>

      <div className="transactions">

        { transactions.length > 0 && transactions.map((transaction) => (

          <Transaction
            key={transaction._id}
            name={transaction.name}
            description={transaction.description}
            price={transaction.price}
            datetime={transaction.datetime}
            id={transaction._id}     
            deleteTransaction={deleteTransaction}
            updateTransaction={updateTransaction}
            setEditMode={setEditMode}
            setEditedName={setEditedName}
            setEditedDatetime={setEditedDatetime}
            setEditedDescription={setEditedDescription}
            setEditedPrice={setEditedPrice}
            setEditingTransactionId={setEditingTransactionId}
            editedDescription={editedDescription}
            editedDatetime={editedDatetime}
            editedPrice={editedPrice}
            editMode={editMode}
            editedName={editedName}
            editModes={editModes}
            toggleEditMode={toggleEditMode}
          />
        ))}

      </div>

    </main>

  );
}


const Transaction = (props) => {
  const {  name, description, price, datetime, id, deleteTransaction, updateTransaction,setEditMode,setEditedName,setEditedDatetime,setEditedPrice, setEditedDescription,
    setEditingTransactionId,editedDescription,editedDatetime,
    editedPrice,editMode,editedName,editModes,toggleEditMode } = props;
    
    const isEditing = editModes[id];
    
    
    const handleEdit = () => {
      setEditMode(true);
      setEditedName(name);
      setEditedDatetime(datetime);
      setEditedPrice(price);
      setEditedDescription(description);
      setEditingTransactionId(id);
      toggleEditMode(id);
      
 
    };
    
    const handleSave = () => {
    // Send the updated data to the backend
    fetch(`${process.env.REACT_APP_API_URL}/transaction/${id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: editedName,
        description: editedDescription,
        datetime: editedDatetime,
        price: editedPrice,
      }),
    })
    .then((response) => {
      if (response.status === 200) {
        // Transaction updated successfully
        setEditMode(false);
        
        setEditMode(false);
        toggleEditMode(id);
        setEditedName(name);
          setEditedDatetime(datetime);
          setEditedPrice(price);
          setEditedDescription(description);
          setEditingTransactionId(null);
        } else {
          // Handle errors
        }
      })
      .catch((error) => {
        // Handle network errors or other issues
      });
    };

    const handleCancel = () => {
      setEditMode(false);
    toggleEditMode(id);
    setEditedName(name);
    setEditedDatetime(datetime);
    setEditedPrice(price)
    setEditedDescription(description);
    setEditingTransactionId(null);
  };
  
  
  
  return (
    <div className="transaction">

        {isEditing ? (
        // Render editable input fields
        <div className="unit">
        <div className="edit-transaction">
          <div className="left">
            <input
              className="name"
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              />
            <input
              className="description"
              type="text"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              />
          </div>

          <div className="right">
             <input
              className="price"
              type="number"
              value={editedPrice}
              onChange={(e) => setEditedPrice(e.target.value)}
              />
            <input
              className="datetime"
              type="datetime-local"
              value={editedDatetime}
              onChange={(e) => setEditedDatetime(e.target.value)}
            />
          </div>

        </div>
          <div className="buttons">

            <div className="save">
              <button className="btn" onClick={handleSave}>Save</button>
            </div>
            <div className="cancel">
              <button className="btn" onClick={handleCancel}>Cancel</button>
            </div>

          </div>

        </div>
      ) : (
      <div className="unit">
      <div className="transactionf">
        <div className="left">
          <div className="name">{name}</div>
          <div className="description">{description}</div>
        </div>

        <div className="right">
          <div className={"price " + (price < 0 ? "red" : "green")}>{price}</div>
          <div className="datetime">{datetime}</div>
        </div>
      </div>

      <div className="buttons">
        <div className="update">
          <button onClick={handleEdit} className="btn">Edit</button>
        </div>
        <div className="delete">
          <button onClick={() => deleteTransaction(id)} className="btn">Delete</button>
        </div>

      </div>
      </div>
      )}

    </div>
  );
};

export default App;