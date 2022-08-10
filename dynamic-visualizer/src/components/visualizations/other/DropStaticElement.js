import React, {useCallback, useState, useMemo, useEffect} from 'react'
import {useDropzone} from 'react-dropzone'

/**
 * code von hier übernommen und bearbeitet:
 * https://www.digitalocean.com/community/tutorials/react-react-dropzone
 */

const baseStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    transition: 'border .3s ease-in-out'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

/**
 * TODO muss persistent sein.
 * @returns {JSX.Element}
 * @constructor
 */
function DropStaticElement() {

    const [dropped, setDropped] = useState(false);
    const [droppedImage, setDroppedImage] = useState(null);
    const [files, setFiles] = useState([]);


    const onDrop = useCallback(acceptedFiles => {
        setDropped(true);
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
    }, []);

    // style konfigurationen
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png'
    });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    const thumbs = files.map(file => (
        <div key={file.name}>
            <img
                src={file.preview}
                alt={file.name}
            />
        </div>
    ));

    // clean up
    useEffect(() => () => {
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);


    return (
        <>
            {
                dropped ?
                    <div>{thumbs}</div>
                    :
                    <div {...getRootProps({style})}>
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                                <p>Drop the files here ...</p> :
                                <p>Drag 'n' drop some files here, or click to select files</p>
                        }
                    </div>
            }
        </>
    )
}

export default DropStaticElement;