import alt from '../alt';
import UIActions from './UIActions';

import SamplesFetcher from '../fetchers/SamplesFetcher';
import MoleculesFetcher from '../fetchers/MoleculesFetcher';
import ReactionsFetcher from '../fetchers/ReactionsFetcher';
import WellplatesFetcher from '../fetchers/WellplatesFetcher';
import LiteraturesFetcher from '../fetchers/LiteraturesFetcher';
import CollectionsFetcher from '../fetchers/CollectionsFetcher';
import ReactionSvgFetcher from '../fetchers/ReactionSvgFetcher';
import ScreensFetcher from '../fetchers/ScreensFetcher';
import SearchFetcher from '../fetchers/SearchFetcher';

import Molecule from '../models/Molecule';
import Sample from '../models/Sample';
import Reaction from '../models/Reaction';

class ElementActions {

  fetchBasedOnSearchSelectionAndCollection(selection, collectionId) {
    SearchFetcher.fetchBasedOnSearchSelectionAndCollection(selection, collectionId)
      .then((result) => {
        this.dispatch(result);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  fetchSampleById(id) {
    SamplesFetcher.fetchById(id)
      .then((result) => {
        this.dispatch(result);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  fetchSamplesByCollectionId(id, queryParams={}) {
    SamplesFetcher.fetchByCollectionId(id, queryParams)
      .then((result) => {
        this.dispatch(result);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  createSample(params) {
    SamplesFetcher.create(params)
      .then((result) => {
        this.dispatch(result.sample)
      });
  }

  updateSample(params) {
    // delete possible null values for scoped update
    for(var key in params) {
      if(params[key] == null) {
        delete params[key];
      }
    }

    SamplesFetcher.update(params)
      .then((result) => {
        this.dispatch(params)
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  fetchReactionsByCollectionId(id, queryParams={}) {
    ReactionsFetcher.fetchByCollectionId(id, queryParams)
      .then((result) => {
        this.dispatch(result);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  fetchReactionById(id) {
    ReactionsFetcher.fetchById(id)
      .then((result) => {
        this.dispatch(result);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  generateEmptyWellplate() {
    const wellplate = {
      id: '_new_',
      type: 'wellplate',
      name: 'New Wellplate',
      size: 96,
      description: '',
      wells: []
    };
    this.dispatch(wellplate);
  }

  createWellplate(wellplate) {
    WellplatesFetcher.create(wellplate)
      .then(result => {
        this.dispatch(result.wellplate);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  updateWellplate(wellplate) {
    WellplatesFetcher.update(wellplate)
      .then(result => {
        this.dispatch(result.wellplate);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  fetchWellplatesByCollectionId(id, queryParams={}) {
    WellplatesFetcher.fetchByCollectionId(id, queryParams)
      .then((result) => {
        this.dispatch(result);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  fetchWellplateById(id) {
    WellplatesFetcher.fetchById(id)
      .then((result) => {
        this.dispatch(result.wellplate);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  fetchScreensByCollectionId(id, queryParams={}) {
    ScreensFetcher.fetchByCollectionId(id, queryParams)
      .then((result) => {
        this.dispatch(result);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  fetchScreenById(id) {
    ScreensFetcher.fetchById(id)
      .then((result) => {
        this.dispatch(result.screen);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  generateEmptyScreen() {
    const screen = {
      id: '_new_',
      type: 'screen',
      name: 'New Screen',
      collaborator: '',
      requirements: '',
      conditions: '',
      result: '',
      description: '',
      wellplates: []
    };
    this.dispatch(screen);
  }

  createScreen(screen) {
    const {wellplates} = screen;
    delete screen.wellplates;
    delete screen.id;
    screen.wellplate_ids = wellplates.map(wellplate => wellplate.id );

    ScreensFetcher.create(screen)
      .then(result => {
        this.dispatch(result.screen);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  updateScreen(screen) {
    const {wellplates} = screen;
    delete screen.wellplates;
    screen.wellplate_ids = wellplates.map(wellplate => wellplate.id );

    ScreensFetcher.update(screen)
      .then(result => {
        this.dispatch(result.screen);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  createReactionLiterature(params) {
    LiteraturesFetcher.create(params)
      .then((result) => {
        this.dispatch(result)
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  generateEmptyReaction() {
    //todo: move to Reaction
    let reaction = new Reaction({
      id: '_new_',
      type: 'reaction',
      //name: 'New Reaction',
      starting_materials: [],
      reactants: [],
      products: [],
      literatures: []

    })
    this.dispatch(reaction)
  }

  createReaction(params) {
    console.log(params)
    ReactionsFetcher.create(params)
      .then((result) => {
        this.dispatch(result)
      });
  }

  updateReaction(params) {
    ReactionsFetcher.update(params)
      .then((result) => {
        this.dispatch(result)
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  deleteReactionLiterature(literature) {
    LiteraturesFetcher.delete(literature)
      .then((result) => {
        this.dispatch(result.reaction_id)
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  fetchLiteraturesByReactionId(id) {
    LiteraturesFetcher.fetchByReactionId(id)
      .then((result) => {
        console.log("Action Fetch Literatures: ");
        console.log(result);
        this.dispatch(result)
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  refreshElements(type) {
    this.dispatch(type)
  }

  generateEmptySample() {
    let sample = new Sample({
      id: '_new_',
      type: 'sample',
      name: 'New Sample',
      external_label: '',
      amount_value: 0,
      amount_unit: 'g',
      description: '',
      purity: 0,
      solvent: '',
      impurities: '',
      location: '',
      molfile: '',
      molecule: {}
    })
    this.dispatch(sample)
  }

  fetchMoleculeByMolfile(molfile) {
    MoleculesFetcher.fetchByMolfile(molfile)
      .then((result) => {
        this.dispatch(result);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  fetchReactionSvgByMaterialsInchikeys(materialsInchikeys){
    ReactionSvgFetcher.fetchByMaterialsInchikeys(materialsInchikeys)
      .then((result) => {
        this.dispatch(result.reaction_svg);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  fetchReactionSvgByReactionId(reaction_id){
    ReactionSvgFetcher.fetchByReactionId(reaction_id)
      .then((result) => {
        this.dispatch(result.reaction_svg);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  deleteElements(ui_state) {
    this.dispatch(ui_state);
    //UIActions.uncheckAllElements('sample');
    //UIActions.uncheckAllElements('reaction');
    //UIActions.uncheckAllElements('wellplate');
  }

  deleteSamplesByUIState(ui_state) {
    SamplesFetcher.deleteSamplesByUIState(ui_state)
      .then((result) => {
        this.dispatch(result);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  deleteReactionsByUIState(ui_state) {
    ReactionsFetcher.deleteReactionsByUIState(ui_state)
      .then((result) => {
        this.dispatch(result);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  deleteWellplatesByUIState(ui_state) {
    WellplatesFetcher.deleteWellplatesByUIState(ui_state)
      .then((result) => {
        this.dispatch(result);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  deleteScreensByUIState(ui_state) {
    ScreensFetcher.deleteScreensByUIState(ui_state)
      .then((result) => {
        this.dispatch(result);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  updateElementsCollection(params) {
    CollectionsFetcher.updateElementsCollection(params)
      .then(() => {
        this.dispatch(params);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  assignElementsCollection(params) {
    CollectionsFetcher.assignElementsCollection(params)
      .then(() => {
        this.dispatch(params);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  removeElementsCollection(params) {
    CollectionsFetcher.removeElementsCollection(params)
      .then(() => {
        this.dispatch(params);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

  splitAsSubsamples(ui_state) {
    SamplesFetcher.splitAsSubsamples(ui_state)
      .then((result) => {
        this.dispatch(ui_state);
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
  }

}

export default alt.createActions(ElementActions);
