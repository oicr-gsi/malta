#! /usr/bin/env python3
"""
Setup script for Malta
"""
from setuptools import setup, find_packages

with open("README.md", "r") as fh:
    long_description = fh.read()

package_version = "1.0.0"
package_root = "flask-server"

setup(
    name="malta",
    version=package_version,
    scripts=[
        "flask-server/extraction.py",
        "flask-server/server.py",
        "flask-server/query_provenance.py",
    ],
    packages=find_packages(where=package_root),
    package_dir={"": package_root},
    install_requires=["pandas", "python-dotenv", "flask", "PyPDF2"],
    python_requires=">=3.8",
    author="Vivek Alamuri",
    author_email="valamuri [at] oicr [dot] on [dot] ca",
    description="Interface to view Sequenza output",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/oicr-gsi/malta/",
    keywords=["cancer", "bioinformatics"],
    license="GPL 3.0",
)
