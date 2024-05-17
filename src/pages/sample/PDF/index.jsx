import { PDFViewer} from '@react-pdf/renderer';
import CreatPDF from "../Selling/creat-PDF";

const PDF = () => {

  return (
      <div>
          <PDFViewer style={{ width: '100%', height: '700px' }}>
              <CreatPDF  />
          </PDFViewer>
      </div>
  );
};

export default PDF;
