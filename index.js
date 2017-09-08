#!/usr/bin/env node

const path = require( 'path' );
const child_process = require( 'child_process' );

var argsESLint = [ '--cache', '--quiet', '--ext=.js,.jsx', '--format=json' ];
var argsESLines = [ '--quiet' ];

const markerIndex = process.argv.indexOf('--');
if ( process.argv.length > 2 && ( -1 === markerIndex || 2 < markerIndex ) ) {
	// use -- as a marker for end of options,
	// so any value that follows the marker is considered an option for ESLines.
	if ( markerIndex > -1 ) {
		argsESLint = argsESLint.concat( process.argv.slice( 2, markerIndex ) );
		argsESLines = argsESLines.concat( process.argv.slice( markerIndex + 1 ) );
	} else {
		argsESLint = argsESLint.concat( process.argv.slice( 2 ) );
	}
} else {
	process.stdout.write( 'No files to lint\n' );
	process.exit( 0 );
}

const eslint = child_process.spawn( path.join( '.', 'eslint', 'bin', 'eslint' ), argsESLint, { shell: true } );
const eslines = child_process.spawn( path.join( '.', 'node_modules', '.bin', 'eslines' ), argsESLines, { shell: true } );

eslint.stdout.on( 'data', ( data ) => {
	eslines.stdin.write( data );
});

eslint.stderr.on( 'data', ( data ) => {
	process.stderr.write( data );
});

eslint.on('close', ( code ) => {
	eslines.stdin.end();
});

eslines.stdout.on( 'data', ( data ) => {
	process.stdout.write( data );
});

eslines.stderr.on( 'data', ( data ) => {
	process.stderr.write( data );
});

eslines.on( 'close', ( code ) => {
	process.exit( code );
});
