// Test file to trigger AI Reviewer

function calculateTotal(items) {
  console.log('Calculating total for items:', items); // Debug statement
  
  let total = 0;
  
  // TODO: Add tax calculation
  for (const item of items) {
    total += item.price;
    console.log('Current total:', total); // Another debug log
  }
  
  // TODO: Implement discount logic
  return total;
}

// TODO: Add unit tests for this function
export default calculateTotal;
