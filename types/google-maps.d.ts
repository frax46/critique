declare namespace google.maps {
  class Autocomplete {
    constructor(
      inputField: HTMLInputElement,
      opts?: AutocompleteOptions
    );
    addListener(eventName: string, handler: Function): void;
    getPlace(): PlaceResult;
  }

  interface AutocompleteOptions {
    types?: string[];
    componentRestrictions?: {
      country: string | string[];
    };
  }

  interface PlaceResult {
    formatted_address?: string;
    address_components?: AddressComponent[];
  }

  interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
  }
}