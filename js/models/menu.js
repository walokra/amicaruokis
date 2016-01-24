define([
  'underscore',
  'backbone'
], function(_, Backbone){
  var MenuModel = Backbone.Model.extend();
  // Return the model for the module
  return MenuModel;
});

/*
{
  "RestaurantName": "Piikeidas",
  "RestaurantUrl": "http://www.amica.fi/ravintolat/ei-avoimet-ravintolat/piikeidas/",
  "PriceHeader": null,
  "Footer": "Hyvät asiakkaat!\n\nRavintola piikeidas on avoinna ajalla 23.6-8.8.14, ma-pe klo 7.30-14.30.\n\nLounas on tarjolla klo 10.30-13.00.\n\nGrilli on suljettuna.\n\n\n\nHyvää ruokahalua!",
  "MenusForDays": [
    {
      "Date": "2014-08-18T00:00:00",
      "SetMenus": [
        {
          "Name": null,
          "Price": null,
          "Components": [
            "Katkarapu-kookoskastiketta (L ,G ,M ,A)",
            "Jasminriisiä (L ,G ,M)",
            "Jauhelihapyöryköitä (L ,M ,A)",
            "Kermaperunoita (L ,G)",
            "Täyteläistä mustapippurikastiketta (L ,G ,A)",
            "Raastepihvejä (L ,M ,* ,A)",
            "Tomaatti-kikhernehöystöä (L ,G ,M)",
            "Kikhernekeittoa (L ,G ,M ,Veg ,A)",
            "Raparperi-kaurapaistosta (L ,M ,A)",
            "Vaniljakastiketta (G ,VL ,A)",
            "Take away: Katkarapusalaatti ()",
            "Ruokasalaatti: Sitrusmarinoituja katkarapuja (A, G, L, M), Raejuustoa (G, L) ()"
          ]
        },
        {
          "Name": null,
          "Price": null,
          "Components": [
            "Naudanlihawok, chiliä, inkivääriä ja kasviksia (L ,G ,M ,VS ,A)"
          ]
        }
      ]
    },
    {
      "Date": "2014-08-19T00:00:00",
      "SetMenus": [
        {
          "Name": null,
          "Price": null,
          "Components": [
            "Pippurista naudanlihakastiketta (L ,G ,A)",
            "Keitettyjä perunoita (L ,G ,M ,*)",
            "Broileri-ananaspannupizzaa (L ,A)",
            "Valkosipulimurskaa (L ,G ,M ,VS)",
            "Quorn -pyttipannua (L ,G ,M ,* ,A)",
            "Täyteläistä sellerisosekeittoa (L ,G ,A)",
            "Karviaiskiisseliä (L ,G ,M ,Veg)",
            "Vaniljakermavaahtoa (L ,G ,A)",
            "Take away: Vuohenjuustosalaatti ()",
            "Ruokasalaatti: Tandoorimarinoitua broileria (G, L, M), Palvikinkkua (L, M, G) ()"
          ]
        },
        {
          "Name": null,
          "Price": null,
          "Components": [
            "Porsaan grillipihvi (L ,G ,M)",
            "Paahdettuja lohkoperunoita (L ,G ,M ,Veg)",
            "Barbecuekastiketta (L ,G ,M ,Veg)"
          ]
        }
      ]
    }
   ]
}
*/