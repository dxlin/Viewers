import { adaptersSEG } from '@cornerstonejs/adapters';
import * as cs from '@cornerstonejs/core';
import * as csTools from '@cornerstonejs/tools';


import OHIF from '@ohif/core';
const { classes, DicomMetadataStore } = OHIF;

import dcmjs from 'dcmjs';
const { datasetToBlob } = dcmjs.data;

const commandsModule = ({
  servicesManager,
  commandsManager,
  extensionManager,
}) => {
  const actions = {
    exportRTSS: ({}) => {
      console.log('>>dicom-rtss exportRTSS');

      // Grab Segmentations
      const { SegmentationService } = servicesManager.services;
      const segmentations = SegmentationService.getSegmentations();

      adaptersSEG.Cornerstone3D.RT.RTSS.generateRTSS(
        segmentations,
        classes.MetadataProvider,
        DicomMetadataStore,
        cs,
        csTools
      ).then(RTSS => {
        console.log('>>RTSS CB');
        console.log(RTSS);
        try {
          const reportBlob = datasetToBlob(RTSS);

          //Create a URL for the binary.
          var objectUrl = URL.createObjectURL(reportBlob);
          window.location.assign(objectUrl);
        } catch(e) {
          console.warn(e);
        }
        console.log('<<RTSS CB');
      });

      console.log('<<dicom-rtss exportRTSS');
    },
    uploadRTSS: ({}) => {
      console.log('>>dicom-rtss uploadRTSS');

      // Grab Segmentations
      const { SegmentationService } = servicesManager.services;
      const segmentations = SegmentationService.getSegmentations();

      adaptersSEG.Cornerstone3D.RT.RTSS.generateRTSS(
        segmentations,
        classes.MetadataProvider,
        DicomMetadataStore,
        cs,
        csTools
      ).then(RTSS => {
        console.log('>>RTSS CB');
        console.log(RTSS);
        const dataSources = extensionManager.getDataSources();
        const dataSource = dataSources[0];
        console.log('upload rtss');
        const { StudyInstanceUID } = RTSS;

        let shouldReplace = false;

        //await dataSource.store.dicom(rtss);
        if (shouldReplace) {
          // NOTE: not implemented - replace if segmentations editted was
          // from existing RTSS

          //if (StudyInstanceUID) {
          //  dataSource.deleteStudyMetadataPromise(StudyInstanceUID);
          //}
        } else {
          dataSource.store.dicom(RTSS); // need save confirmation
        }
        console.log('<<RTSS CB');
      });

      console.log('<<dicom-rtss uploadRTSS');
    },
  };

  const definitions = {
    exportRTSS: {
      commandFn: actions.exportRTSS,
      storeContexts: [],
      options: {},
    },
    uploadRTSS: {
      commandFn: actions.uploadRTSS,
      storeContexts: [],
      options: {},
    },
  };

  return {
    actions,
    definitions,
    defaultContext: 'DICOM_RTSS',
  };
};

export default commandsModule;
