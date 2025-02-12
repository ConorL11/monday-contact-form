import ContactForm from "./components/ContactFormContainer";
import { MondayProvider } from "./components/context";

const App = () => {

  return (
    <div className="App">
      <MondayProvider>
        <ContactForm />
      </MondayProvider>
    </div>
  );
};

export default App;
