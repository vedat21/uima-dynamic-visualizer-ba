import React, {useState, useEffect} from 'react';
import axios from "axios";
import {useParams} from "react-router";
import {v4 as uuid} from 'uuid';

// custom modules
import TopBar from "../components/user_inputs/TopBar";
import VisualizationLayout
  from "../components/visualizations/VisualizationLayout";
import {usedColors, apiEndpoints} from "../helper/envConst"
import savePresentation from "../api_crud/savePresentation";
import useGetData from "../api_crud/useGetData";

/**
 * presentation view of visualizations
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function PresentationView(props) {

  // id of presentation is url parameter. Presentation page should only be accessed via routing.
  const {id} = useParams();

  // title of presentation
  const [title, setTitle] = useState("");
  // enables/disables editing of presentation
  const [editable, setEditable] = useState(false);
  // stores the visualizations
  const [visualizations, setVisualizations] = useState([]);
  // stores the layout of the visualizations
  const [layout, setLayout] = useState([])

  // stores all documents that should be get infromation
  const [selectedDocuments, setSelectedDocuments] = useState([])

  // load existing presentation from api
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get(
            apiEndpoints.basis + apiEndpoints.presentations + id).then(
            (response) => {
              setLayout(response.data.layout);
              setVisualizations(response.data.visualizations);
              setTitle(response.data.title);
              setSelectedDocuments(response.data.documents);
            });
      } catch (error) {
        console.log(error)
      }
    }
    fetchData();
  }, [id])

  //     // set background color of webpage
  document.body.style.background = usedColors.secondary;

  /**
   * to delete a component from view
   * @param component
   */
  function onDeleteComponentClicked(component) {
    saveLayout();
    // id of clicked component
    const id = component.currentTarget.parentElement.parentElement.getAttribute(
        "id");

    // deletes component with id from visualizations
    setVisualizations(visualizations.filter(element => element.id !== id))
  }

  /**
   * adds component to view
   */
  function addVisualization(selectedVisualization, selectedData) {
    saveLayout();
    // if selectedData only contains one element then dont join
    selectedData = Array.isArray(selectedData) ? selectedData.join()
        : selectedData;

    // difference between chart component and other
    if (selectedVisualization.includes("chart")) {
      const dataToAdd = {
        id: uuid(),
        component: selectedVisualization,
        // apiEndpoints.requestParamIds + "632351684ae9b57e41028424" der teil nicht in db speichern sondern von sidebar beziehen
        url: apiEndpoints.basis + apiEndpoints.sum + selectedData
            + apiEndpoints.requestParamNames,
        limit: 5,
        label: "Label",
      };
      /* if bodydata is null then init list with only added data. else add to bodydata.
          (using concat to trigger rerender) */
      visualizations === null ? setVisualizations([dataToAdd])
          : setVisualizations(visualizations.concat([dataToAdd]))
    } else {
      const dataToAdd = {
        id: uuid(),
        component: selectedVisualization,
        content: "x"
      };
      /* if bodydata is null then init list with only added data. else add to bodydata.
         (using concat to trigger rerender) */
      visualizations === null ? setVisualizations([dataToAdd])
          : setVisualizations(visualizations.concat([dataToAdd]));
    }

  }

  /**
   * saves layout global. Is called when visualizations are added or removed.
   */
  function saveLayout() {
    setLayout(window.$localVisualizationLayout);
  }

  /**
   * called when edit button is pressed. disables/enables editormodus and saves presentation to database.
   */
  const onEditableClicked = () => {
    saveLayout();
    const presentation =
        {
          "id": id,
          "title": title,
          "layout": window.$localVisualizationLayout,
          "visualizations": visualizations,
          "documents": selectedDocuments
        }
    savePresentation(presentation);

    setEditable(!editable);
  }

  // funktion von hier https://contactmentor.com/checkbox-list-react-js-example/
  const handleSelectedDocuments = (event, item) => {
    let updatedList = [...selectedDocuments];
    if (event.target.checked) {
      updatedList = [...selectedDocuments, item];
    } else {
      updatedList.splice(selectedDocuments.indexOf(item), 1);
    }
    setSelectedDocuments(updatedList);
  };

  /**
   * on edit title of presentation
   * @param event
   */
  function editTitle(event) {
    saveLayout();
    if (event.keyCode === 13) {
      setTitle(event.target.value);
    }
  }

  return (
      <div>
        <TopBar
            editable={editable} onEditableClicked={onEditableClicked}
            addVisualization={addVisualization}
            title={title} editTitle={editTitle}
            useCase="presentation"
            selectedDocuments={selectedDocuments}
            setS
            handleSelectedDocuments={handleSelectedDocuments}
        />
        <VisualizationLayout
            editable={editable}
            visualizations={visualizations}
            layout={layout}
            onDeleteComponentClicked={onDeleteComponentClicked}
            addVisualization={addVisualization}
            selectedDocuments={selectedDocuments}
        />
      </div>
  )
}

export default PresentationView;