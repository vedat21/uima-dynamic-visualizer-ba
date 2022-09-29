import {useEffect, useState} from "react";
import useGetData from "../../api_crud/useGetData";
import {apiEndpoints, usedColors} from "../../helper/envConst";
import Typography from "@mui/material/Typography";
import {Checkbox, FormControlLabel} from "@mui/material";

function DocumentsCheckBox(props) {

  const {response, loading} = useGetData(
      apiEndpoints.basis + apiEndpoints.documents + apiEndpoints.all
      + apiEndpoints.namesandgroup);

  const [groupsOptions, setGroupsOptions] = useState({});

  // getting document names and their group name
  useEffect(async () => {
    let groupsOptionsCopy = {};
    if (!loading) {
      response.forEach((document) => {
        groupsOptionsCopy[document.group] = [];
      })

      response.forEach((document) => {
        if(!groupsOptionsCopy[document.group].includes(document.name)){
          groupsOptionsCopy[document.group].push(document.name)
        }
      })
      setGroupsOptions(groupsOptionsCopy);
    }
  }, [loading, response])

  /**
   * for selecting/unselecting parent checkbox
   * @param groupName
   */
  function handleSelectedGroup(groupName) {
    let allSelected = true;

    groupsOptions[groupName].forEach((item) => {
      if (!props.selectedDocuments.includes(item)) {
        allSelected = false;
      }
    })

    allSelected ? props.handleUnselectGroup(groupsOptions[groupName])
        : props.handleSelectGroup(groupsOptions[groupName])
  }

  return (
      <>
        <Typography variant="h4">Uima Documents</Typography>
        <br/>
        {loading === false && Object.entries(groupsOptions).map((group) => (
            <>
              <div key={group[0]}>
                <FormControlLabel sx={{transform: "scale(1.2)"}}
                    control=
                        {<Checkbox style={{
                          color: usedColors.secondary,
                        }}
                                   checked={group[1].every(
                                       item => props.selectedDocuments.includes(
                                           item))}
                        />}
                    label={group[0]}
                    onChange={(event) => handleSelectedGroup(group[0])}
                />
              </div>
              {group[1].map((item, index) => (
                  <div key={index}>
                    <FormControlLabel
                        sx={{paddingLeft: "25px"}}
                        control=
                            {<Checkbox style={{
                              color: usedColors.secondary,
                            }}
                                       checked={props.selectedDocuments.includes(
                                           item)}/>}
                        label={item}
                        onChange=
                            {(event) => props.handleSelectedDocuments(
                                event,
                                item)}
                    >
                    </FormControlLabel>
                  </div>
              ))}
            </>
        ))}
      </>
  );
}

export default DocumentsCheckBox