/*eslint-env es6*/
"use strict";
const fs = require('fs');
const properties = require('properties');
const parser = require('xml2json');
const data =fs.readFileSync('/usr/local/EIPS2_CONF/app.properties', {encoding: 'utf8'});
const options = {
	sections: true,
	comments: '#',
	separators: '=',
	strict: true,
};

const ConsumerXml = fs.readFileSync("/usr/local/EIPS2_CONF/consumer-config.xml");
const ProducerXml = fs.readFileSync("/usr/local/EIPS2_CONF/producer-config.xml");
const cloudXml = fs.readFileSync("/usr/local/EIPS2_CONF/cloudVault-Config.xml");
const ConsumerJsonObj = parser.toJson(ConsumerXml,{object: true,alternateTextNode:true,coerce:true});
const ProducerJsonObj = parser.toJson(ProducerXml,{object: true,alternateTextNode:true,coerce:true});
const cloudJsonObj = parser.toJson(cloudXml,{object: true,alternateTextNode:true,coerce:true});
const ConsumerArr=ConsumerJsonObj.consumerconfig.param;
const ProducerArr=ProducerJsonObj.producerconfig.param;
const CloudrArr=cloudJsonObj.cloudVaultconfig.param;

let Cobj={};
let Pobj={};
let cloudObj={};

ConsumerArr.forEach((element)=>{
	Cobj[element.id]=element._t;
});

ProducerArr.forEach((element)=>{
	Pobj[element.id]=element._t;
});

CloudrArr.forEach((element)=>{
	cloudObj[element.id]=element._t;
});

const result=properties.parse(data, options);
exports.appConfig=result;
exports.ConsumObj=Cobj;
exports.ProObj=Pobj;
exports.CloudObj=cloudObj;