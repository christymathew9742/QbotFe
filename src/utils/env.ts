export const AZURE_KEY = 'aaaaaaaaaaaaa5roJbDTFsVUNwz4hYRnCEUi2nSzS8xUoHqdOrvcgDshcdGw67r51JQQJ99AKACYeBjFXJ3w3AAAYACOGsDdb'; 
export const AZURE_REGION = 'aaaaaaaaaaaeastus';

// Ensure variables are loaded
if (!AZURE_KEY || !AZURE_REGION) {
  console.error("Missing Azure Speech Service environment variables.");
  throw new Error("Azure Speech Service credentials are not set!");
}
