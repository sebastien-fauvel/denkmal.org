/**
 * @class Denkmal_FormField_VenueNearby
 * @extends CM_FormField_Abstract
 */
var Denkmal_FormField_VenueNearby = CM_FormField_Abstract.extend({
  _class: 'Denkmal_FormField_VenueNearby',

  /** @type {Number} */
  _watchId: null,

  /** @type {Number} */
  _timeoutId: null,

  ready: function() {
    this.detectLocation();
  },

  detectLocation: function() {
    if (!'geolocation' in navigator) {
      this._setStateFailure();
      return;
    }

    var self = this;
    this._setStateWaiting();

    if (!this._watchId) {
      this._watchId = navigator.geolocation.watchPosition(_.throttle(function(position) {
        self._lookupCoordinates(position.coords.latitude, position.coords.longitude);
      }, 1000), function() {
        self._setStateFailure();
      });
      this.on('destruct', function() {
        navigator.geolocation.clearWatch(self._watchId);
      });
    }

    if (this._timeoutId) {
      window.clearTimeout(this._timeoutId);
    }
    this._timeoutId = this.setTimeout(function() {
      self._setStateFailure();
    }, 1000 * 10);
  },

  /**
   * @param {Number} lat
   * @param {Number} lon
   * @return jqXHR
   */
  _lookupCoordinates: function(lat, lon) {
    var self = this;
    return this.ajax('getVenuesByCoordinates', {lat: lat, lon: lon}, {
      success: function(venueList) {
        if (venueList.length == 0) {
          self._setStateFailure();
        } else {
          self._setStateSuccess(venueList);
        }
      }, error: function() {
        self._setStateFailure();
      }
    });
  },

  _setStateWaiting: function() {
    this.trigger('waiting');
  },

  _setStateFailure: function() {
    this.trigger('failure');
  },

  /**
   * @param {Array} venueList
   */
  _setStateSuccess: function(venueList) {
    var $select = this.getInput();
    $select.empty();
    _.each(venueList, function(venue) {
      $select.append($('<option></option>').attr('value', venue.id).text(venue.name));
    });
    $select.trigger('change');

    this.trigger('success');
  }
});
