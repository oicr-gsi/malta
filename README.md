# Malta

Interface and tracking for clinical report generation

## Introduction

The Clinical Genome Informatics (CGI) group at [OICR](https://oicr.on.ca) produces *clinical reports* on bioinformatics analysis for cancer patients.

The purpose of Malta is:

1. Provide an interface for selecting parameters in clinical reports
2. Track parameters used to generate reports in a database

Malta is complementary to [Djerba](https://github.com/oicr-gsi/djerba), which generates reports from workflow outputs, metadata, and user-selected parameters. It is the successor to [Elba](https://github.com/oicr-gsi/elba), a prototype project which had similar goals but became outdated.

Malta is named for the [island nation](https://en.wikipedia.org/wiki/Malta) in the Mediterranean Sea.

## Sequenza parameter selection

A key step in CGI report generation is choosing from the solutions offered by the Sequenza tool, which in turn determines the purity and ploidy metrics. Manual evaluation of solutions requires clicking through PDF files from a ZIP archive. Malta will provide a more efficient interface for this task, and store the chosen parameters in a database.

## Future work

After Sequenza parameter selection has been implemented, Malta can be built out to provide an interface for other reporting parameters, and to store Djerba configuration files in its database.

## Copyright and License

Copyright (C) 2021 by Genome Sequence Informatics, Ontario Institute for Cancer Research.

Licensed under the [GPL 3.0 license](https://www.gnu.org/licenses/gpl-3.0.en.html).
